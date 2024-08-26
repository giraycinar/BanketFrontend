import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { axiosInstance } from "../../context/AxiosInstance";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { SelectAll } from "@mui/icons-material";
import SelectInput from "@mui/material/Select/SelectInput";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { GrUpdate } from "react-icons/gr";
import { MdPreview } from "react-icons/md";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const QuestionIndex = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [matrixRows, setMatrixRows] = useState("");
  const [matrixColumns, setMatrixColumns] = useState("");
  const [rowTitles, setRowTitles] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [options, setOptions] = useState("");
  const [choicesCount, setChoicesCount] = useState("");
  const [choiceValues, setChoiceValues] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewRowData, setPreviewRowData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/question/get-all");
      const formattedRows = response.data.map((question) => ({
        id: question.uuid,
        questionDescription: question.description,
        questionType: question.questionType,
        options: question.options,
        creationDate: new Date(question.creationDate).toLocaleDateString(),
        creationTime: new Date(question.creationDate).toLocaleTimeString(),
        updatedDate: new Date(question.updatedDate).toLocaleDateString(),
        updatedTime: new Date(question.updatedDate).toLocaleTimeString(),
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Soru çekme hatası:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditMode(false); // Ekleme veya düzenleme işlemi tamamlandığında düzenleme modunu sıfırla
    resetForm(); // Formu sıfırla
  };

  

  const handleShareSelectedQuestion = (row) => {
    setSelectedQuestionId(row.id);
    setPreviewRowData(row);
    setPreviewOpen(true);
  };

  const handleRowTitleChange = (index, value) => {
    const updatedRowTitles = [...rowTitles];
    updatedRowTitles[index] = value;
    setRowTitles(updatedRowTitles);
  };

  const handleColumnTitleChange = (index, value) => {
    const updatedColumnTitles = [...columnTitles];
    updatedColumnTitles[index] = value;
    setColumnTitles(updatedColumnTitles);
  };

  const handleChoicesChange = (index, value) => {
    const updatedChoiceValues = [...choiceValues];
    updatedChoiceValues[index] = value;
    setChoiceValues(updatedChoiceValues);
  };

  const handleSave = async () => {
    try {
      let questionOptions = options;

      if (questionType === "LIKERT") {
        questionOptions = choiceValues.filter(Boolean).join(",");
      } else if (questionType === "MATRIKS") {
        questionOptions = JSON.stringify({
          rows: rowTitles,
          columns: columnTitles,
        });
      } else if (
        questionType === "MULTI_SELECTION" ||
        questionType === "SINGLE_SELECTION" ||
        questionType === "SINGLE_SELECTION_OTHER" ||
        questionType === "MULTI_SELECTION_OTHER"
      ) {
        questionOptions = processChoices();
      }

      const response = await axiosInstance.post("/api/v1/question/save", {
        description: questionDescription,
        questionType: questionType,
        options: questionOptions,
      });

      setSnackbarMessage("Soru başarıyla kaydedildi.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpen(false);
      fetchQuestions();
      resetForm(); // Formu sıfırla
    } catch (error) {
      console.error("Soru oluşturma hatası:", error);
      setSnackbarMessage("Soru kaydedilirken hata oluştu.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const setupUpdateQuestion = () => {
    setQuestionDescription(previewRowData.questionDescription);
    setQuestionType(previewRowData.questionType);
    setChoiceValues(previewRowData.options ? previewRowData.options.split(",") : []);
    setOpen(true);
    setPreviewOpen(false);
    setIsEditMode(true); // Düzenleme modunu aktif et
  };

  const updateQuestion = async () => {
    try {
      let questionOptions = options;

      if (questionType === "LIKERT") {
        questionOptions = choiceValues.filter(Boolean).join(",");
      } else if (questionType === "MATRIKS") {
        questionOptions = JSON.stringify({
          rows: rowTitles,
          columns: columnTitles,
        });
      } else if (
        questionType === "MULTI_SELECTION" ||
        questionType === "SINGLE_SELECTION" ||
        questionType === "SINGLE_SELECTION_OTHER" ||
        questionType === "MULTI_SELECTION_OTHER"
      ) {
        questionOptions = processChoices();
      }

      const response = await axiosInstance.put(`/api/v1/question/update`, {
        uuid: previewRowData.id,
        description: questionDescription,
        questionType: questionType,
        options: questionOptions,
      });

      setSnackbarMessage("Soru başarıyla güncellendi.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpen(false);
      fetchQuestions();
      setIsEditMode(false); // Güncellemeden sonra düzenleme modunu sıfırla
    } catch (error) {
      console.error("Soru güncelleme hatası:", error);
      setSnackbarMessage("Soru güncellenirken hata oluştu.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const deleteQuestion = async () => {
    try {
      const response = await axiosInstance.delete(`/api/v1/question/remove/${selectedQuestionId}`);
      setSnackbarMessage("Soru başarıyla silindi.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setPreviewOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Soru silme hatası:", error);
      setSnackbarMessage("Soru silinirken hata oluştu.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const processChoices = () => {
    if (
      questionType === "MULTI_SELECTION" ||
      questionType === "SINGLE_SELECTION" ||
      questionType === "SINGLE_SELECTION_OTHER" ||
      questionType === "MULTI_SELECTION_OTHER"
    ) {
      return choiceValues.filter(Boolean).join(",");
    }
  };

  const resetForm = () => {
    setQuestionDescription("");
    setQuestionType("");
    setMatrixRows("");
    setMatrixColumns("");
    setRowTitles([]);
    setColumnTitles([]);
    setOptions("");
    setChoicesCount("");
    setChoiceValues([]);
    setSelectedQuestionId(null);
  };

  const renderMatrixInputs = () => {
    const rowInputs = [];
    const columnInputs = [];

    for (let i = 0; i < parseInt(matrixRows); i++) {
      rowInputs.push(
        <TextField
          key={i}
          margin="dense"
          id={`row-${i}`}
          label={`Satır ${i + 1}`}
          type="text"
          fullWidth
          value={rowTitles[i] || ""}
          onChange={(e) => handleRowTitleChange(i, e.target.value)}
        />
      );
    }

    for (let i = 0; i < parseInt(matrixColumns); i++) {
      columnInputs.push(
        <TextField
          key={i}
          margin="dense"
          id={`column-${i}`}
          label={`Sütun ${i + 1}`}
          type="text"
          fullWidth
          value={columnTitles[i] || ""}
          onChange={(e) => handleColumnTitleChange(i, e.target.value)}
        />
      );
    }

    return (
      <>
        <div>
          <InputLabel style={{ marginTop: "10px" }}>Satır Başlıkları</InputLabel>
          {rowInputs}
        </div>
        <div>
          <InputLabel style={{ marginTop: "10px" }}>Sütun Başlıkları</InputLabel>
          {columnInputs}
        </div>
      </>
    );
  };

  const renderChoicesInputs = () => {
    return Array.from({ length: parseInt(choicesCount) }).map((_, index) => (
      <TextField
        key={index}
        margin="dense"
        id={`choice-${index}`}
        label={`Seçenek ${index + 1}`}
        type="text"
        fullWidth
        value={choiceValues[index] || ""}
        onChange={(e) => handleChoicesChange(index, e.target.value)}
      />
    ));
  };

  const columns = [
    { field: "id", headerName: "UUID", width: 300, hidden: true },
    { field: "questionDescription", headerName: "Soru Açıklaması", width: 200, hidden: false },
    { field: "questionType", headerName: "Soru Tipi", width: 200, hidden: false },
    { field: "creationDate", headerName: "Oluşturulma Tarihi", width: 270, hidden: false },
    { field: "creationTime", headerName: "Oluşturulma Saati", width: 270, hidden: false },
    { field: "updatedDate", headerName: "Son Güncelleme Tarihi", width: 270, hidden: false },
    { field: "updatedTime", headerName: "Son Güncelleme Saati", width: 270, hidden: false },
    {
      field: "questionPreview",
      headerName: "Soru Ön İzleme",
      width: 250,
      hidden: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <IconButton onClick={() => handleShareSelectedQuestion(params.row)}  color="primary">
          <MdPreview />
          </IconButton> 
          

          
          <IconButton onClick={() => handleDeleteSelectedQuestion(params.row)} color="secondary">
          <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleDeleteSelectedQuestion = (row) => {
    setSelectedQuestionId(row.id);
    setPreviewRowData(row);
    setPreviewOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ height: "700px", width: "100%", paddingTop: "64px", paddingLeft: "250px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "16px" }}>
        <Button variant="contained" onClick={handleOpen}>
          YENİ SORU EKLE
        </Button>
      </div>

      <DataGrid
        columns={columns.filter((column) => !column.hidden)}
        rows={rows}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20, 100]}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? "Soru Güncelle" : "Yeni Soru Oluştur"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{isEditMode ? "Soruyu güncelleyin." : "Yeni bir soru ekleyin."}</DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="questionType-label">Soru Tipi</InputLabel>
            <Select
              labelId="questionType-label"
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <MenuItem value="OPEN_ENDED">Açık Uçlu</MenuItem>
              <MenuItem value="LIKERT">Likert</MenuItem>
              <MenuItem value="MATRIKS">Matris</MenuItem>
              <MenuItem value="MULTI_SELECTION">Çoklu Seçim</MenuItem>
              <MenuItem value="SINGLE_SELECTION">Tekli Seçim</MenuItem>
              <MenuItem value="SINGLE_SELECTION_OTHER">Tekli Seçim Diğer</MenuItem>
              <MenuItem value="MULTI_SELECTION_OTHER">Çoklu Seçim Diğer</MenuItem>
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            id="questionDescription"
            label="Soru Açıklaması"
            type="text"
            fullWidth
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
          />

          {questionType === "LIKERT" ? (
            <>
              <TextField
                margin="dense"
                id="choicesCount"
                label="Seçenek sayısı"
                type="number"
                fullWidth
                value={choicesCount}
                onChange={(e) => setChoicesCount(e.target.value)}
              />
              {renderChoicesInputs()}
            </>
          ) : questionType === "MATRIKS" ? (
            <>
              <TextField
                margin="dense"
                id="matrixRows"
                label="Satır Sayısı"
                type="number"
                fullWidth
                value={matrixRows}
                onChange={(e) => setMatrixRows(e.target.value)}
              />
              <TextField
                margin="dense"
                id="matrixColumns"
                label="Sütun Sayısı"
                type="number"
                fullWidth
                value={matrixColumns}
                onChange={(e) => setMatrixColumns(e.target.value)}
              />
              {renderMatrixInputs()}
            </>
          ) : questionType === "SINGLE_SELECTION" ||
            questionType === "MULTI_SELECTION" ||
            questionType === "SINGLE_SELECTION_OTHER" ||
            questionType === "MULTI_SELECTION_OTHER" ? (
            <>
              <TextField
                margin="dense"
                id="choicesCount"
                label="Kaç Şık?"
                type="number"
                fullWidth
                value={choicesCount}
                onChange={(e) => setChoicesCount(e.target.value)}
              />
              {renderChoicesInputs()}
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Kapat
          </Button>
          <Button onClick={isEditMode ? updateQuestion : handleSave} color="primary">
            {isEditMode ? "Güncelle" : "Kaydet"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <DialogTitle>Soru Ön İzleme</DialogTitle>
        <DialogContent>
          {previewRowData && (
            <div>
              <h3>Soru:</h3>
              <ul>
                <li>
                  <strong>Soru: </strong>
                  {previewRowData.questionDescription}
                </li>
              </ul>

              {previewRowData.options && previewRowData.options.length > 0 && (
                <div>
                  <h3>Şıklar:</h3>
                  <ul>
                    {previewRowData.options.split(",").map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}

              <h3>Soru Detayları:</h3>
              <ul>
                <li>
                  <strong>UUID:</strong> {previewRowData.id}
                </li>
                <li>
                  <strong>Soru Tipi:</strong> {previewRowData.questionType}
                </li>
                <li>
                  <strong>Oluşturulma Tarihi:</strong> {previewRowData.creationDate}
                </li>
                <li>
                  <strong>Oluşturulma Saati:</strong> {previewRowData.creationTime}
                </li>
                <li>
                  <strong>Son Güncelleme Tarihi:</strong> {previewRowData.updatedDate}
                </li>
                <li>
                  <strong>Son Güncelleme Saati:</strong> {previewRowData.updatedTime}
                </li>
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteQuestion} color="secondary">
            Sil
          </Button>
          <Button onClick={setupUpdateQuestion} color="primary">
            Güncelle
          </Button>
          <Button onClick={() => setPreviewOpen(false)} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default QuestionIndex;
