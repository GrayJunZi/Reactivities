import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from 'react';
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import LoadingConponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from 'uuid';
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

export default observer(function ActivityForm() {
    const navigate = useNavigate();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string; }>();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: '',
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('标题为必填'),
        description: Yup.string().required('描述为必填'),
        category: Yup.string().required('类别为必填'),
        date: Yup.string().required('日期为必填').nullable(),
        city: Yup.string().required('城市为必填'),
        venue: Yup.string().required('venue为必填'),

    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);


    function handleFormSubmit(activity: Activity) {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }

    if (loadingInitial)
        return <LoadingConponent />;

    return (
        <Segment clearing>
            <Header content='Activitiy Detail' sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder="title" name="title" />
                        <MyTextArea rows={3} placeholder="Description" name='description' />
                        <MySelectInput options={categoryOptions} placeholder="Category" name='category' />
                        <MyDateInput
                            placeholderText="Date"
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='yyyy-MM-dd HH:mm:ss'
                        />
                        <Header content='Location Detail' sub color="teal" />
                        <MyTextInput placeholder="City" name='city' />
                        <MyTextInput placeholder="Venue" name='venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated="right" positive type="submit" content="Submit" />
                        <Button as={Link} to='/activities' floated="right" type="button" content="Cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});;