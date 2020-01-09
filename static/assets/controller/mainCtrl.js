var application = angular.module('application');
application.controller('mainCtrl', mainCtrl);
function mainCtrl($scope, $rootScope) {

    $rootScope.loaderFlag = true;
    $scope.load = function () { }
    $scope.load();
}
application.controller('networkListCtrl', networkListCtrl);
function networkListCtrl($scope, $rootScope, $http, $element, FoundationApi) {
    networkListCtrl($scope, $rootScope, $http, $element, FoundationApi);
};
application.directive("connectHolder", ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                if (scope.networkItem.conCls != 'iconNetworkConnected') {
                    var cls = '_' + replaceAll(element.attr('id'), ':', '');
                    var passDialogElm = angular.element('<li class="row password ' + cls + '">' +
                        '<div class="col100">' +
                        '<div class="cell">' +
                        '<div class="grid-block align-center">' +
                        '<div class="small-8 medium-7 large-6 xlarge-5 grid-content">' +
                        '<input class="gridInputInCellPassword" type="password" placeholder="Password" ng-model="connetionIfo.password">' +
                        '</div>' +
                        '<div class="small-2 medium-2 large-1 xlarge-1 grid-content">' +
                        '<a class="btnActionPassword" ng-click="connect(networkItem.ssid)"><span class="icon" data-icon="&#xe07e;"></span></a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>');
                    $compile(passDialogElm)(scope);
                    if ((angular.element(document.querySelector('.' + cls))).length == 0) {
                        angular.forEach(document.querySelector('.password'), function () {
                            document.querySelector('.password').remove();
                        });
                        element.after(passDialogElm);
                    }
                    else {
                        document.querySelector('.' + cls).remove();
                    }

                }
            });
        }
    }
}])

