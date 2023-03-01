import React, { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from "axios";
import { OPENAI_API_KEY } from "../../env.d";
import Spinner from "../../layouts/spinner";
import { Configuration, OpenAIApi } from "openai";

export default function Chatbot() {
    const [payload, setValues] = useState({
        model: "text-davinci-003",
        prompt: "Hello world",
        temperature: 0,
        max_tokens: 200,
        // topP: 1,
        // presencePenalty: 0,
        // frequencyPenalty: 0,
        // bestOf: 1,
        // n: 1,
        // stream: false,
        // stop: ['\n', "testing"]
    });

    const [response, setChatResponse] = useState("")
    const [showSpinner, setShowSpinner] = useState(false)
    const [savedPrompts, setSavedPrompt] = useState([])

    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

   

    const handleUpload = async (event) => {
        setShowSpinner(true)
        try {
            const completion = await openai.createCompletion(payload);
            setChatResponse(completion.data.choices[0].text)
            console.log(completion.data.choices[0].text);
            setShowSpinner(false)
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

    const promptInputChange = (e) =>{
             setValues({
                model: payload.model,
                temperature: payload.temperature,
                max_tokens: payload.max_tokens,
                prompt: e.target.value
            })
        }
    
    

    return (
        <div className=" mx-auto flex flex-col">

            {showSpinner? (
                <div className="relative top-36">            <Spinner/>
                </div>
            ) : ("")}
            <textarea
                className="mx-auto rounded  border-gray-800 border-2 active:border-green-500 bg-grey-100 w-full lg:w-3/4 m-5"
                rows={10}
                value={response}
                readOnly
            />
            <textarea
                className="mx-auto rounded  border-gray-800 border-2 active:border-green-500 bg-grey-100 w-full lg:w-3/4 m-5"
                rows={2}
                value={payload.prompt}
                onChange={promptInputChange}
            />
            <div className="flex w-1/2 mx-auto">
                <button className="mx-auto rounded  bg-white m-4 p-4 border-gray-800 border-2" type="button"
                    onClick={handleUpload}>
                    Send
                </button>
            </div>

        </div>

    );

    }
