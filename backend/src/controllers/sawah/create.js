const getFormattedTimestamp = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const RESPONSE = {
  createSuccess: (data, message) => ({
    success: true,
    code: 200,
    message,
    data,
    pagination: {
      total: data ? data.length : 0,
      per_page: data ? data.length : 0,
      current_page: 1,
      total_pages: 1,
    },
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  createError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const validateFields = {
  checkRequired: (data) => {
    const missingFields = Object.entries(data)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    return missingFields.length > 0 ? missingFields : null;
  },

  validateData: (req) => {
    const {
      id_user,
      lokasi,
      luas,
      foto_lokasi,
      jenis_tanah,
      hasil_panen,
      produksi,
      deskripsi,
      latitude,
      longitude,
    } = req.body;
    const requiredFields = {
      id_user,
      lokasi,
      luas,
      foto_lokasi,
      jenis_tanah,
      hasil_panen,
      produksi,
      deskripsi,
      latitude,
      longitude,
    };

    const missingFieldsResult = validateFields.checkRequired(requiredFields);
    if (missingFieldsResult) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Semua field harus diisi", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    return {
      isValid: true,
      data: requiredFields,
    };
  },
};

module.exports = async (req, res) => {
  const connection = req.db;

  try {
    const validation = validateFields.validateData(req);
    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const [sawahResult] = await connection
      .promise()
      .query("INSERT INTO sawah SET ?", {
        id_user: validation.data.id_user,
        lokasi: validation.data.lokasi,
        luas: validation.data.luas,
        foto_lokasi: validation.data.foto_lokasi,
      });

    const id_sawah = sawahResult.insertId;

    try {
      await connection.promise().query("INSERT INTO detail_sawah SET ?", {
        id_sawah: id_sawah,
        jenis_tanah: validation.data.jenis_tanah,
        hasil_panen: validation.data.hasil_panen,
        produksi: validation.data.produksi,
        deskripsi: validation.data.deskripsi,
        latitude: validation.data.latitude,
        longitude: validation.data.longitude,
      });

      const insertData = {
        sawah: {
          id_user: validation.data.id_user,
          lokasi: validation.data.lokasi,
          luas: validation.data.luas,
          foto_lokasi: validation.data.foto_lokasi,
        },
        detail_sawah: {
          id_sawah: id_sawah,
          jenis_tanah: validation.data.jenis_tanah,
          hasil_panen: validation.data.hasil_panen,
          produksi: validation.data.produksi,
          deskripsi: validation.data.deskripsi,
          latitude: validation.data.latitude,
          longitude: validation.data.longitude,
        },
      };

      return res
        .status(200)
        .json(
          RESPONSE.createSuccess(insertData, "Data sawah berhasil ditambahkan")
        );
    } catch (detailError) {
      console.error("Error inserting into detail_sawah:", detailError);

      await connection
        .promise()
        .query("DELETE FROM sawah WHERE id_sawah = ?", [id_sawah]);

      return res
        .status(400)
        .json(
          RESPONSE.createError(
            400,
            "Gagal menambahkan sawah, latitude dan longitude tidak valid!"
          )
        );
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.createError(500, "Terjadi kesalahan pada server"));
  }
};
