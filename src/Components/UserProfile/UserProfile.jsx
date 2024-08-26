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


const UserProfile = () => {
    const [data, setData] = useState([]);

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [reEmail, setReEmail] = useState("");

    const { handleGetUser } = useContext(UserAPIContext);

    const navigate = useNavigate();


    const goToPasswordUpdate = () => {

        navigate('/password-update');
    };


    const goToUserUpdate = () => {

        navigate('/user-update');
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

    return (
        <div
            style={{
                height: "450px",
                width: "100%",
                paddingTop: "64px",
                paddingLeft: "42%",
            }}
        >
            <h3 className="user_profile_name">Profil</h3>

            <div className="form-container">
                <div className="avatar">
                    <Avatar {...stringAvatar(name + " " + surname)}/>
                </div>

                <form style={{marginLeft: 10}}>

                    <label><strong>Ad :</strong></label>
                    <label className="lbl_1">{data.name}</label><br />

                    <label><strong>Soyad :</strong></label>
                    <label className="lbl_1">{data.surname}</label><br />

                    <label><strong>E-mail Adres :</strong></label>
                    <label className="lbl_1">{data.email}</label><br />

                </form><br />
                <button className="button_addemp" type="submit" style={{marginLeft: 10}} onClick={goToUserUpdate}>
                    <span className="button__text_addemp">Profil Güncelle</span>
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

                <button className="button_addemp" type="submit" style={{marginLeft: 10}} onClick={goToPasswordUpdate}>
                    <span className="button__text_addemp">Şifre Degiştir</span>
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
                </button>
            </div>
        </div>
    );



}
export default UserProfile;