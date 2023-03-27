import { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import useQuery from "../../app/common/util/hooks";
import { useStore } from "../../app/stores/store";
import agent from '../../app/api/agent';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';

export default observer(function ConfirmEmail() {
    const { modalStore } = useStore();
    const token = useQuery().get('token') as string;
    const email = useQuery().get('email') as string;

    const Status = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Success: 'Success',
    };

    const [status, setStatus] = useState(Status.Verifying);

    const handleConfirmEmailResend = () => {
        agent.Account.resentEmailConfirm(email).then(() => toast.success('Verification email resent - please check your email'))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        agent.Account.verifyEmail(token, email).then(() => {
            setStatus(Status.Success);
        }).catch(() => {
            setStatus(Status.Failed);
        });
    }, [Status.Failed, Status.Success, token, email]);

    const getBody = () => {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return (
                    <div>
                        <p>Verification failed. You can try resending the verify link to your email</p>
                        <Button primary onClick={handleConfirmEmailResend} siz='huge' conten='Resend email' />
                    </div>
                );
            case Status.Success:
                return (
                    <div>
                        <p>Email has been verified - you can now login</p>
                        <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size='huge' />
                    </div>
                );
        }
    };

    return (
        <Segment placeholder textAlign='center'>
            <Header icon>
                <Icon name='envelope' />
                Email Verification
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    );
});