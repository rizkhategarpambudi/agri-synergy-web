import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from './Header';
import Footer from './footer';
import '../css/CommunityPage.css';

const CommunityPage = () => {
    const [image, setImage] = useState(null);
    const [komunitas, setKomunitas] = useState([]);
    const navigate = useNavigate();
    const [petaniList, setPetaniList] = useState([]);

    // Fungsi untuk menangani perubahan pada input gambar
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const selectedImage = event.target.files[0];
            setImage(URL.createObjectURL(selectedImage));
        }
    };

    // Fungsi untuk memeriksa autentikasi dan mengambil data komunitas
    const checkAuthentication = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            navigate("/");
            return;
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get(`http://localhost:3000/api/komunitas`);

            if (response.status === 200 && response.data?.data) {
                setKomunitas(response.data.data);
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("jwtToken");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("jwtToken");
                navigate("/");
            }
        }
    };

    const fetchPetani = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/users/:id_users", {
            headers: { id_user: "all" },
          });
      
          if (response.status === 200) {
            const data = response.data?.data;
            
            if (Array.isArray(data)) {
              const petaniData = data.filter((user) => user.role === "petani");
              setPetaniList(petaniData);
            } else {
              console.error("Unexpected data format:", data);
            }
          } else {
            console.error(`Unexpected response status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching petani data:", error.message);
        }
      };
      

    useEffect(() => {
        checkAuthentication();
        fetchPetani();
    }, []);

    return (
        <div className="community-page">
            <Header />

            <div className="content-container">
                {/* Sidebar Kiri */}
                <div className="sidebar-left">
                    <button className="sidebar-button active">
                        <i className="fas fa-users"></i> Community
                    </button>
                    <button
                        className="sidebar-button"
                        onClick={() => navigate('/your-threads')}
                    >
                        <i className="fas fa-hashtag"></i> Your Threads
                    </button>
                    <button className="sidebar-button" onClick={() => navigate('/saved')}>
                        <i className="fas fa-bookmark"></i> Saved
                    </button>
                    <button className="sidebar-button" onClick={() => navigate('/login')}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>

                {/* Konten Utama */}
                <div className="main-content">
                    <div className="share-form">
                        <input type="text" placeholder="Apa yang ingin Anda diskusikan?" />
                        <button className="share-button">Bagikan</button>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="image-input"
                        />

                        {image && (
                            <div className="image-preview">
                                <img src={image} alt="Preview Gambar" />
                            </div>
                        )}
                    </div>

                    <div className="post-container">
                        {komunitas.length > 0 ? (
                            komunitas.map((item, index) => (
                                <div className="post" key={index}>
                                    <div className="post-header">
                                        <p>
                                            <strong>
                                                {item.nama_user}, {item.role_user}
                                            </strong>
                                        </p>
                                        <span>1h ago</span>
                                    </div>
                                    <img
                                        src={`http://localhost:3000/api/fileKomunitas/${item.gambar}`}
                                        alt="imgKomunitas"
                                    />
                                    <p>{item.deskripsi}</p>
                                    <div className="post-actions">
                                        <button className="like-button">
                                            <i className="fas fa-thumbs-up"></i> Like
                                        </button>
                                        <button className="unlike-button">
                                            <i className="fas fa-thumbs-down"></i> Unlike
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Belum ada komunitas yang tersedia.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Kanan */}
                <div className="sidebar-right">
                    <button className="login-button" onClick={() => navigate('/login')}>Login</button>
                    <div className="community-list">
                        <h3>Anggota Komunitas</h3>
                        <ul>
                            {petaniList.length > 0 ? (
                                petaniList.map((petani, index) => (
                                    <li key={index}>{petani.nama}</li>
                                ))
                            ) : (
                                <li>Belum ada petani terdaftar</li>
                            )}
                        </ul>
                    </div>

                    <div className="trending-topics">
                        <h3>Trending Topik</h3>
                        <ul>
                            <li>#Jagung Manis</li>
                            <li>#Tanaman Padi</li>
                            <li>#HapusGuna</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CommunityPage;
