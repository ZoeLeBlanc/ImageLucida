myApp.controller("ViewProjectCtrl", function($scope, $location, $routeParams, UserFactory, ProjectsFactory, FileFactory){
    let project_id = $routeParams.id;
    $scope.project = {};
    $scope.untransformed_files = {};
    $scope.transformed_files = {};
    ProjectsFactory.getSingleProject(project_id).then( (response)=>{
        project_id = "";
        project = JSON.parse(response['project']);
        $scope.project = project[0].fields;
        $scope.project.id = project[0].pk

        
        $scope.untransformed_files = JSON.parse(response['untransformed_files']);
        console.log($scope.untransformed_files);
        $scope.transformed_files = JSON.parse(response['transformed_files']);
        
    });
});