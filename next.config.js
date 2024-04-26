// next.config.js

module.exports = {
    async rewrites() {
        return [
            {
                source: '/products/details/:productId',
                destination: '/products/details',
            },
            {
                source: '/products/edit/:productId',
                destination: '/products/edit',
            },
            {
                source: '/logs/:logId',
                destination: '/logs/viewLogApps',
            },
            {
                source: '/logs/:logId/:productId',
                destination: '/logs/viewLogAppDetails',
            },
            {
                source: '/logs/viewMonthLogs/:year/:month',
                destination: '/logs/viewMonthLogs',
            },
            {
                source: '/api/search/:key',
                destination: 'http://127.0.0.1:5000/api/search/:key',
            },
        ];
    }

};
