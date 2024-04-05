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
                    <Button key="login" type="primary" onClick={onLogin} style={{ fontFamily: "Montserrat, sans-serif", fontWeight:"400", display:"inline-flex", alignItems:"center",}}>
                        <img src="./images/logo-2.png" alt="GitHub" style={{ verticalAlign:"middle", marginRight:10, width:18, }} />
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
