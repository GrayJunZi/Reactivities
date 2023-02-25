import axios from "axios";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Button, Header, Segment } from "semantic-ui-react";
import ValidationError from "./ValidationError";

export default function TestErrors() {
    const baseUrl = 'http://localhost:5248/api';

    const [errors, setErrors] = useState(null);

    const handleNotFound = () => {
        axios.get(baseUrl + '/buggy/not-found').catch(err => console.log(err.response));
    };

    const handleBadRequest = () => {
        axios.get(baseUrl + '/buggy/bad-request').catch(err => console.log(err.response));
    };

    const handleServerError = () => {
        axios.get(baseUrl + '/buggy/server-error').catch(err => console.log(err.response));
    };

    const handleUnauthorized = () => {
        axios.get(baseUrl + '/buggy/unauthorized').catch(err => console.log(err.response));
    };

    const handleBadGuid = () => {
        axios.get(baseUrl + '/buggy/notaguid').catch(err => console.log(err.response));
    };

    const handleValidationError = () => {
        axios.post(baseUrl + '/buggy/activities', {}).catch(err => setErrors(err));
    };

    return (
        <>
            <ToastContainer position="bottom-right" hideProgressBar />
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths={7}>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Reuqest' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorized} content='Unauthorized' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors && <ValidationError errors={errors} />}
        </>
    );
}