import React, {useEffect, useState} from 'react';
import * as echarts from 'echarts';

const PieChart = () => {
    const [legends, setLegends] = useState();
    const [pageBtn, setPageBtn] = useState();
    const [page, setPage] = useState(1);
    const color = ['#1890FF', '#FAD337', '#4DCB73', '#F2637B', '#228B22', '#90EE90', '#FF4500', '#4B0082', '#800000'];
    const pieData = [
        {
            name: "轮台县",
            value: 1
        },
        {
            name: "伽师县",
            value: 2
        },
        {
            name: "河间市",
            value: 2
        },
        {
            name: "且末县",
            value: 1
        },
        {
            name: "新和县",
            value: 3
        },
        {
            name: "库车市",
            value: 1
        },
        {
            name: "深州市",
            value: 1
        },
        {
            name: "巴楚县",
            value: 3
        },
        {
            name: "麦盖提县",
            value: 1
        },
        {
            name: "莎车县",
            value: 1
        },
        {
            name: "阳谷县",
            value: 1
        },
        {
            name: "柯坪县",
            value: 1
        },
        {
            name: "亭湖区",
            value: 1
        },
        {
            name: "大名县",
            value: 1
        }
    ];
    useEffect(() => {
        let pieChart = echarts.getInstanceByDom(document.getElementById('pie-chart'));
        if (!pieChart) {
            pieChart = echarts.init(document.getElementById('pie-chart'));
        }
        let option = {
            title: {
                text: 100,
                top: '20%',
                left: 'center',
                textStyle: {
                    color: '#333333',
                    fontSize: 32,
                    fontWeight: 500,
                },
                subtext: '设备(台)',
                subtextStyle: {
                    color: '#333333',
                    fontSize: 14,
                    fontWeight: 400,
                },
                itemGap: 0,
            },
            color: color,
            tooltip: {
                trigger: 'item',
                formatter: '{b}{d}% {c}台',
            },
            legend: {
                show: false,
                type: 'scroll',
                orient: 'horizontal',
                bottom: '1%',
                pageTextStyle: {
                    overflow: 'break',
                },
                padding: 0,
                selectorLabel: {
                    show: true,
                },
                formatter: [
                    '{a|{name}}',
                    '{b|{name}}',
                ],
                rich: {
                    a: {
                        width: 100,
                        color: 'red',
                        lineHeight: 10,
                    },
                    b: {
                        height: 40,
                    },
                },
            },
            series: [
                {
                    name: '作业地点',
                    type: 'pie',
                    radius: ['40%', '60%'],
                    center: ['50%', '32%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: true,
                    },
                    data: pieData,
                },
            ],
        };
        pieChart.setOption(option)
    });
    const handleBtnPagePlus = () => {
        let arr = [];
        let dataLen = pieData.length;
        let colorLen = color.length;
        let count = Math.ceil(dataLen / colorLen);
        // color 不够,末尾再重复一遍
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < colorLen; j++) {
                color.push(color[j]);
            }
        }
        let start = 6 * page;
        let end = start + 6;
        setPage(page + 1);
        for (let i = start; i < end; i++) {
            let name = pieData[i].name
            let div = <div key={i} style={{display: 'inline', marginLeft: 100, color: color[i]}}>{name}</div>
            arr.push(div);
            if ((i + 1) % 2 === 0) {
                arr.push(<br/>)
            }
        }
        setLegends(arr);
    };
    const handleBtnPageReduce = () => {
        let arr = [];
        let dataLen = pieData.length;
        let colorLen = color.length;
        let count = Math.ceil(dataLen / colorLen);
        // color 不够,末尾再重复一遍
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < colorLen; j++) {
                color.push(color[j]);
            }
        }
        let start = 6 * (page - 1);
        let end = start + 6;
        setPage(page - 1);
        for (let i = start; i < end; i++) {
            let name = pieData[i].name
            let div = <div key={i} style={{display: 'inline', marginLeft: 100, color: color[i]}}>{name}</div>
            arr.push(div);
            if ((i + 1) % 2 === 0) {
                arr.push(<br/>)
            }
        }
        setLegends(arr);
    };
    const handleBtnShowClick = () => {
        let arr = [];
        let dataLen = pieData.length;
        let colorLen = color.length;
        let count = Math.ceil(dataLen / colorLen);
        // color 不够,末尾再重复一遍
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < colorLen; j++) {
                color.push(color[j]);
            }
        }
        if (dataLen > 6) {
            let btn =
                <div>
                    <button onClick={handleBtnPagePlus}>下一页</button>
                    <button onClick={handleBtnPageReduce}>上一页</button>
                </div>;
            setPageBtn(btn);
            setPage(1);
        }

        let start = 0;
        let end = 6;
        for (let i = start; i < end; i++) {
            let name = pieData[i].name
            let div = <div key={i} style={{display: 'inline', marginLeft: 100, color: color[i]}}> {name}</div>
            arr.push(div);
            if ((i + 1) % 2 === 0) {
                arr.push(<br/>)
            }
        }
        setLegends(arr);
    };
    return (
        <div>
            <button onClick={handleBtnShowClick}>show</button>
            <div id="pie-chart" style={{width: 500, height: 500}}>
            </div>
            <div id="my-legend" style={{backgroundColor: 'gray'}}>
                {legends} {pageBtn} {page}
            </div>
        </div>
    );
};

export default PieChart;
