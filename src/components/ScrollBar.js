import React from 'react';
import '../css/scroll-bar.css';

const ScrollBar = () => {
    const handleBtnUpClick = () => {
        document.getElementById('main').scrollTop += 60;
    };

    const handleBtnDownClick = () => {
        document.getElementById('main').scrollTop -= 60;
    };

    return (
        <>
            <div id="main" className="container">
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
                <li>6</li>
                <li>7</li>
                <li>8</li>
                <li>9</li>
                <li>10</li>
                <li>11</li>
                <li>12</li>
                <li>13</li>
                <li>14</li>
                <li>15</li>
                <li>16</li>
            </div>
            <button onClick={handleBtnUpClick}>Up</button>
            <button onClick={handleBtnDownClick}>Down</button>
        </>
    );
};

export default ScrollBar;
