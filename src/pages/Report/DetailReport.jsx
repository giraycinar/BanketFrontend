import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { axiosInstance } from "../../context/AxiosInstance";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { MdPreview } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useLocation } from 'react-router-dom';

const DetailReport = () => {
    const [rows, setRows] = useState([]);
    const [emails, setEmails] = useState([]);
    const location = useLocation();
    const { surveyId, groupUuid, surveyName, groupName } = location.state || {};

    const getGroupDetail = async (groupName) => {
        try {
            const response = await axiosInstance.get(`/api/v1/student/get-by-name/${groupName}`);
            const students = response.data;
            
            const rowsWithSurveyData = await Promise.all(students.map(async (student) => {
                const surveyData = await getSendedSurvey(surveyId, student.email);
                if (!surveyData) {
                    setEmails(prevEmails => [...prevEmails, student.email]); // Anket tamamlanmamışsa email listesini güncelle
                }
                return {
                    id: student.uuid,
                    studentName: student.name,
                    studentSurname: student.surname,
                    studentEmail: student.email,
                    surveyCompleted: !!surveyData, 
                };
            }));
            
            setRows(rowsWithSurveyData);
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };

    const getSendedSurvey = async (surveyId, email) => {
        try {
            const response = await axiosInstance.get(`/api/v1/filled-survey/get-by-mail-and-survey-id/${surveyId}/${email}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching survey data:", error);
        }
    };

    useEffect(() => {
        if (groupName) {
            getGroupDetail(groupName);
        }
    }, [groupName]);

    const handleDetailReport = (email) => {
        // Define your logic for detailed report
        console.log("Detail report for:", email);
    };

    const handleSendSurvey = async (surveyId, email) => {
        const payload = {
            surveyId: surveyId,
            studentEmail: email
        };
        try {
            const response = await axiosInstance.post(`/api/v1/mail/send-mail-by-student`, payload);
            response.data ? alert("Anket gönderildi") : alert("Anket gönderilemedi");
        } catch (error) {
            console.error("Error sending survey:", error);
        }
    };

    const handleStudentListSendSurvey = async () => {
        const payload = {
            surveyId: surveyId,
            emailList: emails
        };
        try {
            const response = await axiosInstance.post(`/api/v1/mail/send-mail-by-student-list`, payload);
            response.data ? alert("Anketler gönderildi") : alert("Anketler gönderilemedi");
        } catch (error) {
            console.error("Error sending surveys:", error);
        }
    };

    const columns = [
        { field: "id", headerName: "UUID", width: 300, hidden: true },
        { field: "studentName", headerName: "Ögrenci Adı", width: 200 },
        { field: "studentSurname", headerName: "Ögrenci Soyadı", width: 200 },
        { field: "studentEmail", headerName: "Email Adresi", width: 300 },
        {
            field: "DetailReport",
            headerName: "Detaylı Görüntüle",
            width: 200,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleDetailReport(params.row.studentEmail)}
                    color="primary"
                    disabled={!params.row.surveyCompleted} 
                >
                    <MdPreview />
                </IconButton>
            )
        },
        {
            field: "sendedSurvey",
            headerName: "Anket Gönder",
            width: 200,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleSendSurvey(surveyId, params.row.studentEmail)}
                    color="primary"
                    disabled={params.row.surveyCompleted}
                >
                    <IoSend />
                </IconButton>
            )
        },
    ];

    return (
        <div
            style={{
                height: "450px",
                width: "100%",
                paddingTop: "64px",
                paddingLeft: "250px",
            }}
        >
            <div style={{ marginTop: "16px", marginLeft: "16px" }}>Anket İsmi : {surveyName} </div>
            <div style={{ marginTop: "16px", marginLeft: "16px" }}>Grup Ismi : {groupName} </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "16px", marginRight: "36px" }}>
                <Button variant="contained" onClick={handleStudentListSendSurvey}>
                    Cevaplanmayan anketleri tekrar gönder
                </Button>
            </div>

            <DataGrid style={{ minHeight: "600px" }}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 15]}
            />
        </div>
    );
};

export default DetailReport;
