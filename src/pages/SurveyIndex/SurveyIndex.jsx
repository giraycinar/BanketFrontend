import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {axiosInstance} from "../../context/AxiosInstance"; 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import QuestionsSelected from "./QuestionsSelected"; 
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send'; 
import { MdPreview } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { Diamond } from "@mui/icons-material";
import { GrUpdate } from "react-icons/gr";
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';



const SurveyIndex = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openShareSurveyForm, setOpenShareSurveyForm] = useState(false);
  const [surveyName, setSurveyName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false); 
  const [previewRowData, setPreviewRowData] = useState(null);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState([]);
  const [groupNames, setGroupNames] = useState('');

  const [previewOpen2, setPreviewOpen2] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteSurveyId, setDeleteSurveyId] = useState(null);





  const resetForm = () => {
   
    setSelectedSurvey('');
    setSelectedQuestions([]);
  
  };


  const deleteQuestion = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/survey/delete/${uuid}`);
      console.log("Soru silindi:", response.data);
      setPreviewOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Soru silme hatası:", error);
    }
  };


  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false); 
    resetForm(); 
  };
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = selectedQuestions[dragIndex];
    draggedItem.order=dragIndex
    const newItems = [...selectedQuestions];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    setSelectedQuestions(newItems);
  };

  const getSurvey = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/survey/get-all");
      const formattedRows = response.data.map((survey) => ({
        id: survey.uuid,
        surveyName: survey.name,
        creationDate: new Date(survey.creationDate).toLocaleDateString(),
        creationTime: new Date(survey.creationDate).toLocaleTimeString(),
        updatedDate: new Date(survey.updatedDate).toLocaleDateString(),
        updatedTime: new Date(survey.updatedDate).toLocaleTimeString(),
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const getQuestions = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/question/get-all");
      console.log("Sorular alındı:", response.data); // Bu satırı ekleyin
      setQuestions(response.data);
    } catch (error) {
      console.error("Soru çekme hatası:", error);
    }
  };
  



  useEffect(() => {
    getSurvey();
    getQuestions();
  }, []);
  
  const columns = [
    { field: "id", headerName: "UUID", width: 300, hidden: true },  
    { field: "surveyName", headerName: "Anket İsmi", width: 200, hidden: false },
    { field: "creationDate", headerName: "Oluşturulma Tarihi", width: 200, hidden: false },
    { field: "creationTime", headerName: "Oluşturulma Saati", width: 200, hidden: false },
    { field: "updatedDate", headerName: "Son Güncelleme Tarihi", width: 200, hidden: false },
    { field: "updatedTime", headerName: "Son Güncelleme Saati", width: 200, hidden: false },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 300,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton onClick={() => { setSelectedSurvey(params.row); setOpenShareSurveyForm(true); }} color="primary">
            <IoSend />
          </IconButton>
          <IconButton onClick={() => handlePreviewOpen(params.row)} color="primary">
            <MdPreview />
          </IconButton>
          <IconButton onClick={() => handleUpdateOpen(params.row)} color="primary">
            <GrUpdate />
          </IconButton>
          <IconButton onClick={() => handleClickDelete(params.row)} color="primary">
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
    
  ];
  const handleClickDelete = (row) => {
    setSelectedSurvey(row);
    setConfirmOpen(true);
  };
  
  
  const handleClickOpen = () => {
    setSurveyName(''); // Anket ismini temizle
    setSelectedQuestions([]); // Soruları temizle
    setOpen(true);
  };
  

  
  const handleClickSurveyShareOpen = () => {
    selectedSurveyIds.length > 0 ? setConfirmOpen(true) : alert("Paylaşılacak anket seçmeniz gerekmektedir!");
  };

  

  const handleSelectChange = (index, value) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index].id = value;
    setSelectedQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (index, value) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index].isRequired = value;
    setSelectedQuestions(updatedQuestions);
  };

  const handleClickSurveyShareClose = () => {
    setOpenShareSurveyForm(false);
  };

  const handleCreateSurvey = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/survey/save", {
        name: surveyName,
        questions: selectedQuestions.map(({ id, isRequired }) => ({
          questionId: id,
          required: isRequired
        }))
      });
      console.log("Yeni anket oluşturuldu:", response.data);
      setOpen(false);
      getSurvey();
    } catch (error) {
      console.error("Anket oluşturma hatası:", error);
    }
  };
  
  
  const handleUpdateSurvey = async () => {
    if (selectedSurvey) {
      try {
        const response = await axiosInstance.put("/api/v1/survey/update", {
          uuid: selectedSurvey.id,
          name: surveyName,
          questions: selectedQuestions.map(({ id, isRequired }) => ({
            questionId: id,
            required: isRequired
          }))
        });
        console.log("Anket güncellendi:", response.data);

        // Güncellenmiş verilerle ön izleme ekranını güncelle
        const updatedQuestions = await getQuestionsBySurvey(selectedSurvey.id);
        setPreviewRowData({
          ...selectedSurvey,
          name: surveyName,
          questions: updatedQuestions
        });

        setPreviewOpen2(false); // Güncelleme ekranını kapat
        setPreviewOpen(true); // Ön izleme ekranını aç
        getSurvey(); // Güncellenmiş veriler için yeniden yükleme
      } catch (error) {
        console.error("Anket güncelleme hatası:", error);
      }
    } else {
      console.error("Seçilen anket bulunamadı!");
    }
  
  };
  

  
  const handleShareSurvey = () => {
    setConfirmOpen(false);
    setOpenShareSurveyForm(true);
  };



  const handleShareSurveySubmit = async () => {
    const payload = {
      surveyUuid: selectedSurveyIds[0],
      groupNames: groupNames.split(',').map(item => item.trim())
    }
    console.log("Hazırlanan payload : ", payload);
    try {
      const response = await axios.post("/api/v1/mail/send-survey", payload);
      setOpenShareSurveyForm(false);
    } catch (error) {
      console.error("Anket paylaşma hatası:", error);
    }
  };
  

  const handleAddQuestion = () => {
    setSelectedQuestions([...selectedQuestions, { id: "", isRequired: false }]);
  };

  const handleRemoveQuestion = async (index) => {
    const questionToRemove = selectedQuestions[index];
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions.splice(index, 1);
    setSelectedQuestions(updatedQuestions);
  
    try {
      const response = await axiosInstance.delete(`/api/v1/survey/delete-question`, {
          data: {
              surveyUuid: selectedSurvey.id,
              questionId: questionToRemove.id
          },
          headers: {
              'Content-Type': 'application/json'
          }
      });
      console.log("Soru silindi:", response.data);
  } catch (error) {
      console.error("Soru silme hatası:", error);
  }
  
  };
  


  const handleSelectedSurveysChange = (selection) => {
    if (selection.length > 0) {
      const selectedId = selection[0];
      const selectedSurvey = rows.find(row => row.id === selectedId);
      setSelectedSurvey(selectedSurvey);
    }
    setSelectedSurveyIds(selection);
  };
  

  const getQuestionsBySurvey = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/v1/survey/get/${id}`);
      return response.data.questions; // Soruları döndür
    } catch (error) {
      console.error("Anket sorularını alma hatası:", error);
      return [];
    }
  };
  

  const handlePreviewOpen = async (row) => {
    // Güncellenmiş soruları al
    const updatedQuestions = await getQuestionsBySurvey(row.id);
    setPreviewRowData({
      ...row,
      questions: updatedQuestions // Güncellenmiş soruları ekleyin
    });
    setPreviewOpen(true);
  };
  
  
 
  const handleUpdateOpen = async (row) => {
    const questions = await getQuestionsBySurvey(row.id);
    setSelectedSurvey({ ...row, questions });
    setSurveyName(row.surveyName);
  
    // Güncellenmiş soruları seçilen sorular olarak ayarla
    setSelectedQuestions(questions.map(q => ({
      id: q.questionId,
      isRequired: q.required
    })));
  
    setPreviewOpen2(true);
  };
  const handleUpdateDelete = async (row) => {
    const questions = await getQuestionsBySurvey(row.id);
    setSelectedSurvey({ ...row, questions });
    setSurveyName(row.surveyName);
  
    // Güncellenmiş soruları seçilen sorular olarak ayarla
    setSelectedQuestions(questions.map(q => ({
      id: q.questionId,
      isRequired: q.required
    })));
  
    setPreviewOpen2(true);
  };
  

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleClosePreview2 = () => { 
    setPreviewOpen2(false);
  };

  const handleConfirmOpen = (row) => {
    setSelectedSurvey(row);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };
  

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/survey/delete/${selectedSurvey.id}`);
      console.log("Anket silindi:", response.data);
      setConfirmOpen(false);
      getSurvey(); // Listeyi güncelle
    } catch (error) {
      console.error("Anket silme hatası:", error);
    }
  };
  
  

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
        <Button 
          variant="contained" 
          onClick={handleClickSurveyShareOpen}
        >
          SEÇİLEN ANKETİ PAYLAŞ
        </Button>
        <Button 
          variant="contained" 
          onClick={handleClickOpen}
        >
          YENİ ANKET EKLE
        </Button>
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
        checkboxSelection
        onRowSelectionModelChange={handleSelectedSurveysChange}
      />
      
      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Yeni Anket Oluştur</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Lütfen yeni anketin detaylarını girin.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="surveyName"
      label="Anket İsmi"
      type="text"
      fullWidth
      value={surveyName}
      onChange={(e) => setSurveyName(e.target.value)}
    />
    <DndProvider backend={HTML5Backend}>
      {selectedQuestions.map((selected, index) => (
        <QuestionsSelected
          key={index}
          index={index}
          item={selected}
          moveItem={moveItem}
          onSelectChange={handleSelectChange}
          onCheckboxChange={handleCheckboxChange}
          onRemoveItem={() => handleRemoveQuestion(index)}
          questions={questions}
        />
      ))}
    </DndProvider>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      İptal
    </Button>
    <Button onClick={handleCreateSurvey} color="primary">
      Oluştur
    </Button>
    <Button onClick={handleAddQuestion} color="primary">
      Soru Ekle
    </Button>
  </DialogActions>
</Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>{"Anket Paylaş"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`"${selectedSurvey ? selectedSurvey.surveyName : ''}" adlı anketi paylaşmak istediğinize emin misiniz?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleShareSurvey} color="primary">
            Paylaş
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openShareSurveyForm} onClose={() => setOpenShareSurveyForm(false)}>
        <DialogTitle>Paylaşılacak Anketi Seç</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lütfen anketi paylaşılacak grup adını girin (virgülle ayırarak):
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="groupNames"
            label="Grup Adları"
            fullWidth
            value={groupNames}
            onChange={(e) => setGroupNames(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickSurveyShareClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleShareSurveySubmit} color="primary">
            Gönder
          </Button>
        </DialogActions>
      </Dialog>






      <Dialog open={previewOpen} onClose={handleClosePreview}>
  <DialogTitle>Anket Ön İzleme</DialogTitle>
  <DialogContent>
    {previewRowData && (
      <>
        <DialogContentText>Anket İsmi: {previewRowData.surveyName}</DialogContentText>
        <DialogContentText>Oluşturulma Tarihi: {previewRowData.creationDate}</DialogContentText>
        <DialogContentText>Son Güncelleme Tarihi: {previewRowData.updatedDate}</DialogContentText>
        
        <DialogContentText>Sorular:</DialogContentText>
        
        {Array.isArray(previewRowData.questions) && previewRowData.questions.length > 0 ? (
          <ul>
            {previewRowData.questions.map((question) => (
              <li key={question.questionId}>
                {questions.find(q => q.id === question.questionId)?.description || "Soru bulunamadı"}
                ({questions.find(q => q.id === question.questionId)?.questionType || "Tip bilinmiyor"})
              </li>
            ))}
          </ul>
        ) : (
          <DialogContentText>Henüz soru yok.</DialogContentText>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosePreview} color="primary">
      Kapat
    </Button>
  </DialogActions>
</Dialog>





      <Dialog open={confirmOpen} onC  lose={handleConfirmClose}>
        <DialogTitle>Gönder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Göndermek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Hayır
          </Button>
          <Button onClick={handleShareSurveySubmit} color="primary">
            Evet
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen2} onClose={handleClose}>
        <DialogTitle>Anket Güncelle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="surveyName"
            label="Anket İsmi"
            type="text"
            fullWidth
            variant="standard"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
          {console.log("selectedQuestions : ", selectedQuestions)}
          {selectedQuestions.map((question, index) => (
  <div key={index} style={{ marginTop: 16 }}>
    <TextField
      select
      fullWidth
      value={question.id}
      onChange={(e) => handleSelectChange(index, e.target.value)}
      SelectProps={{ native: true }}
    >
      {questions.map((q) => (
        <option key={q.id} value={q.id}>{q.description}</option>
      ))}
    </TextField>
    <TextField
      type="checkbox"
      checked={question.isRequired}
      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
    />
    <Button variant="outlined" color="error" onClick={() => handleRemoveQuestion(index)}>
      Soru Sil
    </Button>
  </div>
))}

          <Button variant="outlined" onClick={handleAddQuestion}>
            Soru Ekle
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview2}>İptal</Button>
          <Button onClick={handleUpdateSurvey}>Kaydet</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Anket Paylaş</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Anket paylaşmak istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClosePreview2}>İptal</Button>
    <Button onClick={handleUpdateSurvey}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Onay</DialogTitle>
        <DialogContent>
          <DialogContentText>İşlemi onaylamak istiyor musunuz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Hayır</Button>
          <Button onClick={() => { /* Onay işlemi */ }}>Evet</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
  <DialogTitle>Silme Onayı</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Bu anketi silmek istediğinize emin misiniz?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleConfirmClose}>İptal</Button>
    <Button onClick={confirmDelete} color="primary">
      Sil
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default SurveyIndex;