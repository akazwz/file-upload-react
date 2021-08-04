import './App.css';
import FileUpload from './pages/FileUpload';
import ComBox from './components/ComBox';
import PieChart from "./components/PieChart";
import ScrollBar from "./components/ScrollBar";


const App = () => {
    const arr = [
        13456453, 25345345, 7456756, 7682454, 34534534,
        3453476768, 78956756878, 34578933, 7897899789,
        'huanying', 'dajia', 'geige', 'star',
        'he', 'follow', 'my', 'github', 'is', 'akazwz',
        '欢迎', '大家', '给个', 'star',
    ];
    return (
        <div>
            <FileUpload/>
            <div style={{marginLeft: 50}}>
                <ComBox data={arr}/>
            </div>
            <ScrollBar/>
        </div>
    );
};


export default App;
