import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/util/hooks";

export default observer(function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    const handleConfirmEmailResend = () => {
        agent.Account.resentEmailConfirm(email).then(() => toast.success('Verification email resent - please check your email'))
            .catch(err => console.log(err));
    };

    return (
        <Segment placeholder textAlign="center">
            <Header icon color="green">
                <Icon name="check" />
                Successfully registered!
            </Header>
            <p>Please check your email (including junk email) for the verification email</p>
            {email && (
                <>
                    <p>Didn't receive the email? Click the below button to resend</p>
                    <Button primary onClick={handleConfirmEmailResend} content='Resend email' size="huge" />
                </>
            )}
        </Segment>
    );
});