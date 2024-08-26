import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {axiosInstance} from "../../context/AxiosInstance"; 
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { MdPreview } from "react-icons/md";



const Report = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
   
   const goDetailReport = (row) => {
    navigate("/detail-report", { state: { 
      surveyId: row.surveyId,
       groupUuid: row.groupUuid,
       surveyName: row.surveyName,
       groupName: row.groupName,
      } });
  };

  const getSurvey = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/sended-survey/get-all");
      console.log(response.data);
      const formattedRows = response.data.map((survey) => ({
        id: survey.uuid,
        surveyName: survey.surveyName,
        surveyId: survey.surveyId,
        groupName: survey.groupName,
        groupUuid: survey.groupUuid,
        sendedAt: new Date(survey.sendedAt).toLocaleDateString(),
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };


  useEffect(() => {
    getSurvey();
    }, []);
    
  const columns = [
    { field: "id", headerName: "UUID", width: 300, hidden: true },  
    { field: "surveyName", headerName: "Anket İsmi", width: 200, hidden: false },
    { field: "groupName", headerName: "Grup İsmi", width: 200, hidden: false },
    { field: "sendedAt", headerName: "Gönderilme Tarihi", width: 200, hidden: false },
    { field: "status", headerName: "Durum", width: 200, hidden: false },   
    {
      field: "DetailReport",
      headerName: "Detaylı Görüntüle",
      width: 200,
      renderCell: (params) => (
        <IconButton 
        onClick={()=>goDetailReport(params.row)}
         color="primary">
          <MdPreview />
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
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "16px" }}>
      
      </div>
      
      <DataGrid
        rows={rows}
        columns={columns.filter(column => !column.hidden)} 
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />

    </div>
  );
};

export default Report;