from rest_framework import serializers
from EmployeeApp.models import Departments, MachineLearning

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = ('DepartmentId',
                  'DepartmentName',)


class MachineLearningSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineLearning
        fields = ('MachineLearningId',
                  'TypeOfSheet',
                  'TrainingDataFileName',
                  'SheetFileName',
                  'Output',
                  'TrainingDataContent')