import { useContext, useState, useEffect } from "react";
import "./UserProfile.css";
import { UserAPIContext } from "../../context/UserAPIContext";
import AuthService from "../../service/AuthService";
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { fontSize, height, margin, width } from "@mui/system";
import { blue } from "@mui/material/colors";



const PasswordUpdate = () => {

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const [data, setData] = useState([]);
    const { handleGetUser } = useContext(UserAPIContext);

    
    useEffect(() => {
        const res = handleGetUser(AuthService.getCurrentUser().token);
        res.then((res) => {
            setData(res.data);
        })

            .catch((err) => {
               // console.log(err);
            })
    }, []);

    const { handlePasswordUpdateUser } = useContext(UserAPIContext);

    const navigate = useNavigate();

    const goToUserProfile = () => {

        navigate('/user-profile');
    };
    
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: blue[300],
                width: 135,
                height: 135,
                margin:5,
                fontSize: 60,
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }



    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (password === rePassword) {
            if (password.length >= 8 && password.match(/[A-Z]/) && password.match(/[0-9]/)) {
                const authUser = AuthService.getCurrentUser();
                const payload = {
                    "token": authUser.token,
                    "password": password.trim(),
                }
                handlePasswordUpdateUser(payload);
            }
            else{
                alert("Şifre en az 8 karakterli olmalı.En az bir büyük harf ve rakam içermelidir. ")
            }

        }
        else {
            alert("Girilen şifreler aynı degil.")
        }
    };
    return (
        <div
            style={{
                height: "450px",
                width: "100%",
                paddingTop: "64px",
                paddingLeft: "42%",
            }}
        >
            <h3 className="user_profile_name">Şifre Güncelle</h3>
            <div className="form-container">
            <div className="avatar">
                    <Avatar {...stringAvatar(data.name+" "+data.surname)}/>
                </div>
                <form >
                    <label>Şifre</label>
                    <input
                        className="user_profile_input"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Yeni Şifre"
                        required
                    />
                    <label>Şifre (Tekrar)</label>
                    <input
                        className="user_profile_input"
                        type="password"
                        name="repassword"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Yeni Şifre (Tekrar)"
                        required
                    />

                    <br />
                    <button className="button_addemp" type="submit" onClick={(e)=>{handlePasswordUpdate(e); goToUserProfile();}}>
                        <span className="button__text_addemp">Şifreyi Degiştir</span>
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
export default PasswordUpdate;