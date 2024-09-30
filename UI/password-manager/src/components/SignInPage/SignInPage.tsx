import React, { FC, useState } from 'react';
import {Input, SIZE} from "baseui/input";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = () => {
    const [value, setValue] = useState("Hello");

    return (
        <Input
            value={value}
            size={SIZE.large}
            placeholder="bob@gmail.com"
            type="email"
        />
    );
};







export default SignInPage;
