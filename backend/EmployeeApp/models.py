from django.db import models


# Create your models here.

class Departments(models.Model):
    DepartmentId = models.AutoField(primary_key=True)
    DepartmentName = models.CharField(max_length=100)


class MachineLearning(models.Model):
    SHEET = (
        ('Balance Sheet', 'Balance Sheet'),
        ('Profit and Loss', 'Profit and Loss'),
    )
    MachineLearningId = models.AutoField(primary_key=True)
    TypeOfSheet = models.CharField(max_length=40, choices=SHEET)
    TrainingDataFileName = models.CharField(max_length=100)
    SheetFileName = models.CharField(max_length=100)
    Output = models.TextField(max_length=100000)
    TrainingDataContent = models.TextField(max_length=100000, default='EMPTY')
    