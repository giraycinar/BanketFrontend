import React, { useEffect, useState } from 'react';
import './DisplaySurvey.css';
import './DisplaySurvey.css';
import axios from 'axios';
import { QuestionType } from './Helper/DisplaySurveyEnums';
import DynamicTable from './DynamicTable';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const DisplaySurvey = () => {
    const handleChangee = (event) => {
        const { name, value } = event.target;
        setResponses(prevResponses => ({
            ...prevResponses,
            [name]: value
        }));
        const location = useLocation();
        const queryParams = queryString.parse(location.search);
        const surveyId = queryParams.surveyId;
    };

    const [responses, setResponses] = useState({ q: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setResponses({ ...responses, [name]: value });
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(responses);
    };

    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8081/api/v1/question/get-all" //`http://localhost:8081/api/v1/survey/get/${surveyId}` //"http://localhost:8081/api/v1/question/get-all"
                );
                setTodos(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTodos();
    }, []);

    return (
        <div className="anket-container">
            <h2>Eğitim Anketi</h2>
            <form onSubmit={handleSubmit}>
                <div className="soru">
                    {
                        todos.length > 0 &&
                        todos.map((todo, index) => {
                            let soruElementi;
                            switch (todo.questionType) {
                                case QuestionType.OPEN_ENDED:
                                    return (
                                        <div>
                                            <div>
                                                <p>{todo.description}</p>
                                            </div>
                                            <div>
                                                <textarea rows="4" cols="50"></textarea>
                                            </div>
                                        </div>
                                    );

                                case QuestionType.LIKERT:
                                    const likertOptions = todo.options.split(',').map(option => option.trim());
                                    return (
                                        <div>
                                            <div>
                                                <p>{todo.description}</p>
                                            </div>
                                            <div className="radio-group">
                                                {likertOptions.map((_, value) => (
                                                    <label key={value}>
                                                        <input type="radio" name={`q${index}`} value={value + 1} onChange={handleChange} /> {value + 1}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );

                                case QuestionType.MATRIKS:
                                    return (
                                        <div key={index}>
                                            <p>{todo.description}</p>
                                            <DynamicTable options={JSON.parse(todo.options)} />
                                        </div>
                                    );

                                case QuestionType.MULTI_SELECTION:
                                    const multiSelectionOptions = todo.options.split(',').map(option => option.trim());
                                    return (
                                        <div>
                                            <p>{todo.description}</p>
                                            <div>
                                                {multiSelectionOptions.map((option, optionIndex) => (
                                                    <div key={optionIndex}>
                                                        <input type="checkbox" id={`option-${index}-${optionIndex}`} name={`options-${index}`} value={option} onChange={handleChange} />
                                                        <label htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );

                                case QuestionType.SINGLE_SELECTION:
                                    const singleSelectionOptions = todo.options.split(',').map(option => option.trim());
                                    return (
                                        <div>
                                            <p>{todo.description}</p>
                                            <div>
                                                {singleSelectionOptions.map((option, optionIndex) => (
                                                    <div key={optionIndex}>
                                                        <input
                                                            type="radio"
                                                            id={`option-${index}-${optionIndex}`}
                                                            name={`options-${index}`}
                                                            value={option}
                                                            onChange={handleChangee}
                                                        />
                                                        <label htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );

                                default:
                                    soruElementi = null;
                            }
                            return (
                                <div key={index}>
                                    <p>{todo.description}</p>
                                    {soruElementi}
                                </div>
                            );
                        })
                    }
                </div>
                <button type="submit">Gönder</button>
            </form>
        </div>
    );
    <div className="anket-container">
        <h2>Eğitim Anketi</h2>
        <form onSubmit={handleSubmit}>
            <div className="soru">
                {
                    todos.length > 0 &&
                    todos.map((todo, index) => {
                        let soruElementi;
                        switch (todo.questionType) {
                            case QuestionType.OPEN_ENDED:
                                return (
                                    <div>
                                        <div>
                                            <p>{todo.description}</p>
                                        </div>
                                        <div>
                                            <textarea rows="4" cols="50"></textarea>
                                        </div>
                                    </div>
                                );

                            case QuestionType.LIKERT:
                                const likertOptions = todo.options.split(',').map(option => option.trim());
                                return (
                                    <div>
                                        <div>
                                            <p>{todo.description}</p>
                                        </div>
                                        <div className="radio-group">
                                            {likertOptions.map((_, value) => (
                                                <label key={value}>
                                                    <input type="radio" name={`q${index}`} value={value + 1} onChange={handleChange} /> {value + 1}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );

                            case QuestionType.MATRIKS:
                                return (
                                    <div key={index}>
                                        <p>{todo.description}</p>
                                        <DynamicTable options={JSON.parse(todo.options)} />
                                    </div>
                                );

                            case QuestionType.MULTI_SELECTION:
                                const multiSelectionOptions = todo.options.split(',').map(option => option.trim());
                                return (
                                    <div>
                                        <p>{todo.description}</p>
                                        <div>
                                            {multiSelectionOptions.map((option, optionIndex) => (
                                                <div key={optionIndex}>
                                                    <input type="checkbox" id={`option-${index}-${optionIndex}`} name={`options-${index}`} value={option} onChange={handleChange} />
                                                    <label htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );

                            case QuestionType.SINGLE_SELECTION:
                                const singleSelectionOptions = todo.options.split(',').map(option => option.trim());
                                return (
                                    <div>
                                        <p>{todo.description}</p>
                                        <div>
                                            {singleSelectionOptions.map((option, optionIndex) => (
                                                <div key={optionIndex}>
                                                    <input
                                                        type="radio"
                                                        id={`option-${index}-${optionIndex}`}
                                                        name={`options-${index}`}
                                                        value={option}
                                                        onChange={handleChangee}
                                                    />
                                                    <label htmlFor={`option-${index}-${optionIndex}`}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );

                            default:
                                soruElementi = null;
                        }
                        return (
                            <div key={index}>
                                <p>{todo.description}</p>
                                {soruElementi}
                            </div>
                        );
                    })
                }
            </div>
            <button type="submit">Gönder</button>
        </form>
    </div>
    
}

export default DisplaySurvey;
