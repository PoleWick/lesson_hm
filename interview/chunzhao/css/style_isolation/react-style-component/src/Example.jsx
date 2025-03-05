import React from 'react';
import styled from 'styled-components';

const ExampleComponent = () => {
    // Props.children
    return (
        <StyleEample>
            <p>这是一个带有styled-components的样式</p>
        </StyleEample>
    );
}
// css in js 解决样式的隔离问题
const StyleEample = styled.div`
    padding:20px;
    border-radius: 5px;
    background-color: #f0f0f0;
    p {
        color: red;
        font-size: 14px;
    }
`;

export default ExampleComponent;