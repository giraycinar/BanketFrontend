import { useContext, useState } from "react";
import "./AddManager.css";
import { UserAPIContext } from "../../context/UserAPIContext";

const AddManager = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(false);

  const {handleAddManager} = useContext(UserAPIContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && surname.trim() && email.trim()) {
      const payload = {
        name: name.trim(),
        surname: surname.trim(),
        gender: gender ? "FEMALE" : "MALE",
        email: email.trim(),
      };
      handleAddManager(payload);
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
      <h3 className="add_employee_name">Yönetici Ekle</h3>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            className="add_employee_input"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad"
            required
          />
          <input
            className="add_employee_input"
            type="text"
            name="lastName"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Soyad"
            required
          />
          <input
            className="add_employee_input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <div className="gender-selectorr">
            <label className="gender-labell">
              <input
                className="addemp_gender_input"
                type="radio"
                name="radio"
                value="male"
                checked={!gender}
                onChange={() => setGender(false)}
              />
              <span>Erkek</span>
            </label>
            <label className="gender-labell">
              <input
                className="addemp_gender_input"
                type="radio"
                name="radio"
                value="female"
                checked={gender}
                onChange={() => setGender(true)}
              />
              <span className="gender-span">Kadın</span>
            </label>
          </div>
          <br />
          <button className="button_addemp" type="submit">
            <span className="button__text_addemp">Sisteme Kaydet</span>
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
        </form>
      </div>
    </div>
  );
};

export default AddManager;
