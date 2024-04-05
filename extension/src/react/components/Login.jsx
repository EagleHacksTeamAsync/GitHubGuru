import React from "react";
import { Modal, Button } from "antd";

const Login = ({ userData, onLogin, onLogout  }) => {
    const isModalVisible = !userData;

    return (
        <>
            <Modal
                title="Login Required"
                visible={isModalVisible}
                onCancel={() => {}}
                footer={[
                    <Button key="login" type="primary" onClick={onLogin}>
                        Login with GitHub
                    </Button>,
                ]}
                width={350}
                centered
            >
                <p>You must log in with GitHub to use this extension.</p>
            </Modal>


        </>
    );
};

export default Login;
