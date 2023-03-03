import axios, { Axios } from "axios";
import { SERVER_URL } from "../../env.d";
import { BehaviorSubject } from "rxjs";

export const sendChat$ = new BehaviorSubject("");
export const getPrefixes$ = new BehaviorSubject([]);

export function sendChat(payload: any): any[] {
  axios
    .post(SERVER_URL + "/chats", payload)
    .then(function (response) {

      const chatResponse = response.data.choices[0].text.replace(/\r?\n{1,2}|\r/, "");
      sendChat$.next(chatResponse);
      return chatResponse;
    })
    .catch(function (error) {
      console.log(error);
    });
   
}

export function getPrefixes(): any[] {
  axios
    .get(SERVER_URL + "/chats/prefixes")
    .then(function (response) {
      const prefixes = response.data
      getPrefixes$.next(prefixes);
      return prefixes;
    })
    .catch(function (error) {
      console.log(error);
    });
   
}

