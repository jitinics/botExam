angular.module('botApp', [])
  .controller('botAppController', ['$scope', '$http', function ($scope, $http) {
    getkeywordList()
    $scope.save = function () {
      var req = {
        method: 'POST',
        url: './keyword',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'key': $scope.key,
          'value': $scope.ans
        }
      }
      $http(req).then(function (res) {
        alert(res.data)
        $scope.key = ''
        $scope.ans = ''
        getkeywordList()
      })
    }
    $scope.edit = function (key, val) {
      $scope.key = key
      $scope.ans = val
    }
    $scope.delete = function (key) {
      var req = {
        method: 'DELETE',
        url: './keyword',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'key': $scope.key
        }
      }
      $http(req).then(function (res) {
        alert(res.data)
        getkeywordList()
      })
    }
    function getkeywordList () {
      console.log('dasf')
      var req = {
        method: 'GET',
        url: './keyword',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      $http(req).then(function (res) {
        $scope.list = res.data
        console.log($scope.list)
      })
    }
  }])
