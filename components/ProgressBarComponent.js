import { useEffect } from "react";
import Router from "next/router";
import ProgressBar from "nextjs-progressbar"; // 导入正确的库

const ProgressBarComponent = () => {
    useEffect(() => {
        const start = () => {
            ProgressBar.start();
        };

        const end = () => {
            ProgressBar.done();
        };

        Router.events.on("routeChangeStart", start);
        Router.events.on("routeChangeComplete", end);
        Router.events.on("routeChangeError", end);

        return () => {
            Router.events.off("routeChangeStart", start);
            Router.events.off("routeChangeComplete", end);
            Router.events.off("routeChangeError", end);
        };
    }, []);

    return null; // 此组件不渲染任何内容
};

export default ProgressBarComponent;
