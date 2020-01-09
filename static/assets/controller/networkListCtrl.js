
function networkListCtrl($scope, $rootScope, $http, $element, FoundationApi) {
    $scope.networksInf = [];
    $scope.connetionIfo = [];
    $scope.load = function () {



        $http.get('/getAvailableNetworks', {}, { headers: { 'Content-Type': 'application/json' } }).success(function (response) {
            $scope.networksInf = response.resultSet;
            var ifaceState = response.ifaceState;
            $rootScope.loaderFlag = false;
            if (ifaceState.connection === 'connected') {
                angular.forEach($scope.networksInf.networks, function (item, key) {
                    if (item.ssid === ifaceState.ssid) {
                        item.connectionStatus = 'Disconect';
                        item.conCls = 'iconNetworkConnected';
                    } else {
                        item.connectionStatus = 'Connect';
                        item.conCls = 'connectCls';
                    }
                });
            }
            else {

                angular.element(document.querySelector('#successMsg')).addClass('connectDialogCls');
                angular.forEach($scope.networksInf.networks, function (item, key) {
                    item.connectionStatus = 'Connect';
                    item.conCls = 'connectCls';
                });
            }
        });

    }
    $scope.load();

    $scope.connDis = function (connection) {
        if (connection.connectionStatus === 'Connect') {
            $scope.connetionIfo.ssid = connection.ssid;
            angular.element(document.querySelector('#connectDialog')).removeClass('connectDialogCls');
        } else {
            $scope.disconnect();
        }
    };
    $scope.connect = function (ssid) {
        $rootScope.loaderFlag = true;
        var obj = {};
        obj.ssid = ssid;
        obj.password = $scope.connetionIfo.password;
        $http.post('/connectToNetwork', JSON.stringify(obj), { headers: { 'Content-Type': 'application/json' } }).success(function (response) {
            $rootScope.loaderFlag = false;

            if (response.success !== false)
                FoundationApi.publish('main-notifications', { title: 'success', content: response.msg, autoclose: "3000", color: "success" });
            else {
                FoundationApi.publish('main-notifications', { title: 'warning', content: response.msg, autoclose: "3000", color: "warning" });
            }
            console.log(response.msg);
            $scope.load();
        }).error(function (response) {
            $rootScope.loaderFlag = false;
            FoundationApi.publish('main-notifications', { title: 'warning', content: response.msg, autoclose: "3000", color: "warning" });

        });
    }

    $scope.disconnect = function () {

        var obj = {};
        obj.type = '1';

        $http.post('http://localhost/getAdsType', JSON.stringify(obj), { headers: { 'Content-Type': 'application/json' } }).success(function (response) {

        });
    }
    setInterval(function () {
        $scope.load();
    }, 60000)
}
