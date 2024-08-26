import { useContext, useState, useEffect } from "react";
import * as React from 'react';
import "./UserProfile.css";
import { UserAPIContext } from "../../context/UserAPIContext";
import AuthService from "../../service/AuthService";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { fontSize, height, margin, width } from "@mui/system";
import { blue } from "@mui/material/colors";


const UserUpdate = () => {
    const [data, setData] = useState([]);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [reEmail, setReEmail] = useState("");

    const { handleUpdateUser } = useContext(UserAPIContext);
    const { handleGetUser } = useContext(UserAPIContext);

    const navigate = useNavigate();

    const goToUserProfile = () => {

        navigate('/user-profile');
    };



    useEffect(() => {
        const res = handleGetUser(AuthService.getCurrentUser().token);
        res.then((res) => {
            setData(res.data);
            setName(res.data.name);
            setSurname(res.data.surname);
            setEmail(res.data.email);
            setReEmail(res.data.email);
        })

            .catch((err) => {
               // console.log(err);
            })
    }, []);


    const handleUpdate = (e) => {
        e.preventDefault();
        if (email === reEmail) {
            const authUser = AuthService.getCurrentUser();
            const payload = {
                "token": authUser.token,
                "name": name.trim(),
                "surname": surname.trim(),
                "email": email.trim(),
            }
            handleUpdateUser(payload);
        }
        else {
            alert("Email'i hatalı girdiniz.")
        }
      
    }; 
     function stringAvatar(name) {
            return {
                sx: {
                    bgcolor: blue[300],
                    width: 135,
                    height: 135,
                    margin: 5,
                    fontSize: 60,
                },
                children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
            };
        }
    return (
        <div
            style={{
                height: "450px",
                width: "100%",
                paddingTop: "64px",
                paddingLeft: "42%",
            }}
        >
            <h3 className="user_profile_name">Profil Güncelle</h3>
            <div className="form-container">
                <div className="avatar">
                    <Avatar {...stringAvatar(name + " " + surname)} />
                </div>
                <form >

                    <label>Ad</label>
                    <input
                        className="user_profile_input"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={data.name}
                        required
                    />
                    <label>Soyad</label>
                    <input
                        className="user_profile_input"
                        type="text"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder={data.surname}
                        required
                    />
                    <label>Email Adres</label>
                    <input
                        className="user_profile_input"
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={data.email}
                        required
                    />
                    <label>Email Adres (Tekrar)</label>
                    <input
                        className="user_profile_input"
                        type="text"
                        name="email"
                        value={reEmail}
                        onChange={(e) => setReEmail(e.target.value)}
                        placeholder={data.email}
                        required
                    />

                    <br />
                    <button className="button_addemp" type="submit" onClick={(e) => { handleUpdate(e); goToUserProfile(); }}>
                        <span className="button__text_addemp">Güncelle</span>
                        <span className="button__icon_addemp">
                            <svg
                                className="svg"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line x1="12" x2="12" y1="5" y2="19"></line>
                                <line x1="5" x2="19" y1="12" y2="12"></line>
                            </svg>
                        </span>
                    </button><br />

                </form>
            </div>
        </div>
    );



}
export default UserUpdate;