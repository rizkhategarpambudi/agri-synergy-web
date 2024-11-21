const bcrypt = require("bcrypt");
const {validasiEmail, validasiKatasandi, validasiHandphone} = require("../../utils/validation");

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
    timestamp: new Date().toISOString(),
    errors: null,
  }),

  createError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    pagination: null,
    timestamp: new Date().toISOString(),
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

  validateData: async (req) => {
    const { nama, no_hp, alamat, email, katasandi } = req.body;
    const requiredFields = { nama, no_hp, alamat, email, katasandi };

    const missingFieldsResult = validateFields.checkRequired(requiredFields);
    if (missingFieldsResult) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Semua field harus diisi", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    const validations = [
      {
        condition: !validasiHandphone(no_hp),
        errorMessage: "Format nomor handphone tidak valid",
      },
      {
        condition: !validasiEmail(email),
        errorMessage: "Format email tidak valid",
      },
      {
        condition: !validasiKatasandi(katasandi),
        errorMessage:
          "Kata sandi harus minimal 8 karakter, memiliki huruf besar, kecil, angka, dan simbol",
      },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        return {
          isValid: false,
          error: RESPONSE.createError(400, validation.errorMessage),
        };
      }
    }

    const [emailExists] = await req.db
      .promise()
      .query("SELECT 1 FROM user WHERE email = ?", [email]);
    if (emailExists.length > 0) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Email sudah digunakan"),
      };
    }

    const [phoneExists] = await req.db
      .promise()
      .query("SELECT 1 FROM user WHERE no_hp = ?", [no_hp]);
    if (phoneExists.length > 0) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Nomor handphone sudah digunakan"),
      };
    }

    return {
      isValid: true,
      data: { ...requiredFields, katasandi: await bcrypt.hash(katasandi, 10) },
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const [rows] = await req.db
      .promise()
      .query("INSERT INTO user SET ?", validation.data);

    return res
      .status(200)
      .json(RESPONSE.createSuccess(rows, "Data user berhasil ditambahkan"));
  } catch (err) {
    console.error(err);
    const errorResponse = RESPONSE.createError(
      500,
      "Terjadi kesalahan pada server",
      { message: err.message, code: err.code || "INTERNAL_SERVER_ERROR" }
    );
    return res.status(errorResponse.code).json(errorResponse);
  }
};
