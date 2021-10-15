from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from EmployeeApp.models import Departments, MachineLearning
from EmployeeApp.serializers import DepartmentSerializer, MachineLearningSerializer

from django.core.files.storage import default_storage

# Machine Learning Imports

import pandas as pd
import csv
import json
import difflib
import shutil
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from csv import reader


from PIL import Image
from pytesseract import pytesseract
from tabulate import tabulate

import re

class MyClass:
    output = []


# Create your views here.
@csrf_exempt
def departmentApi(request,id=0):
    if request.method=='GET':
        departments = Departments.objects.all()
        departments_serializer = DepartmentSerializer(departments, many=True)
        return JsonResponse(departments_serializer.data, safe=False)

    elif request.method=='POST':

        data1 = {
            'DepartmentId': 5,
            'DepartmentName': 'yo bro'
        }
        department_data=JSONParser().parse(request)

        name = department_data["DepartmentName"]
        department_data["DepartmentName"] = "test" + name

        print(department_data)
        department_serializer = DepartmentSerializer(data=department_data)
        if department_serializer.is_valid():
            department_serializer.save()
            return JsonResponse("Added Successfully!" , safe=False)
        return JsonResponse("Failed to Add!.",safe=False)
    
    elif request.method=='PUT':
        department_data = JSONParser().parse(request)
        department=Departments.objects.get(DepartmentId=department_data['DepartmentId'])
        department_serializer=DepartmentSerializer(department,data=department_data)
        if department_serializer.is_valid():
            department_serializer.save()
            return JsonResponse("Updated Successfully!", safe=False)
        return JsonResponse("Failed to Update!", safe=False)

    elif request.method=='DELETE':
        department=Departments.objects.get(DepartmentId=id)
        department.delete()
        return JsonResponse("Deleted Successfully!", safe=False)

@csrf_exempt
def machineLearningApi(request,id=0):
    # GET method
    if request.method=='GET':
        machineLearnings = MachineLearning.objects.all()
        machineLearnings_serializer = MachineLearningSerializer(machineLearnings, many=True)
        return JsonResponse(machineLearnings_serializer.data, safe=False)

    # POST method
    elif request.method=='POST':
        m = MyClass()
        machineLearning_data=JSONParser().parse(request)

        # Get data from the front end
        trainpic = machineLearning_data["TrainingDataFileName"]
        filepic = machineLearning_data["SheetFileName"]
        typeSheet = machineLearning_data["TypeOfSheet"]

        # OCR

        # Tesseract OCR initalization
        path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        image_path = r"./media/" + filepic
        
        img = Image.open(image_path)
        
        pytesseract.tesseract_cmd = path_to_tesseract
        
        text = pytesseract.image_to_string(img) # Get the text from image and put it into a variable
        
        # Displaying the extracted text

        words = text[:-1].splitlines()

        newArray = []

        # OCR & Machine learning for Balance Sheet
        if typeSheet == "Balance Sheet":

            print("Balance Sheet Successful")

            # Loop through OCR words and clean the data
            for x in words:
                # Cleaning OCR data by getting rid of unnecessary symbols
                regex = re.compile('[^a-zA-Z -]')
                x = regex.sub('', x)
                x = x.strip()

                # More data cleaning
                if not x or x == " " or x == ", " or x == "," or len(x) <=  2 or x == "":
                    pass
                else:
                    # Add to an array of new words for cleaned data
                    x = x.replace(',', '')
                    newstring = ''.join([i for i in x if not i.isdigit()])
                    newArray.append(newstring)
            
            # More data cleaning, except we are cleaning words that are too similar to the account type.
            # This is so we don't end up with keywords that are actually ment to be category names
            for x in newArray[:]:

                x1 = x.lower()

                similarity = 0.90 # A similarity with a 90% or above will remove the word
                s1 = difflib.SequenceMatcher(None, x1, "total current assets").ratio()
                if s1 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                
                s2 = difflib.SequenceMatcher(None, x1, "non-current assets").ratio()
                if s2 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s3 = difflib.SequenceMatcher(None, x1, "total non-current assets").ratio()
                if s3 >= similarity:
                    if x in newArray:
                        newArray.remove(x)

                s4 = difflib.SequenceMatcher(None, x1, "total assets").ratio()
                if s4 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s4 = difflib.SequenceMatcher(None, x1, "current liabilities").ratio()
                if s4 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s5 = difflib.SequenceMatcher(None, x1, "total current liabilities").ratio()
                if s5 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s6 = difflib.SequenceMatcher(None, x1, "non-current liabilities").ratio()
                if s6 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s7 = difflib.SequenceMatcher(None, x1, "total non-current liabilities").ratio()
                if s7 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s8 = difflib.SequenceMatcher(None, x1, "total liabilities").ratio()
                if s8 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s9 = difflib.SequenceMatcher(None, x1, "net assets").ratio()
                if s9 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s10 = difflib.SequenceMatcher(None, x1, "equity").ratio()
                if s10 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                    
                s11 = difflib.SequenceMatcher(None, x1, "total equity").ratio()
                if s11 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                
                s12 = difflib.SequenceMatcher(None, x1, "current assets").ratio()
                if s12 >= similarity:
                    if x in newArray:
                        newArray.remove(x)


            # Machine Learning

            df = pd.read_csv("./media/" + trainpic) # Reading CSV from media file and putting it into df variable
            df.groupby('stdAccType').describe()
            df['type']=df['stdAccType'].apply(lambda x: 1 if x=='current asset' else (2 if x=='current liability' else (3 if x=='equity' else (4 if x=='non-current asset' else (5 if x=='non-current liability' else 0)))))
            df.sort_values(by=['keyword'])

            X, y = df.keyword.fillna(' '), df.type

            # SKlearn machine learning
            from sklearn.model_selection import train_test_split
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

            from sklearn.feature_extraction.text import CountVectorizer
            v = CountVectorizer()
            X_train_count = v.fit_transform(X_train.values)
            X_train_count.toarray()[:3]

            from sklearn.naive_bayes import MultinomialNB
            model = MultinomialNB()
            model.fit(X_train_count,y_train)

            m.output.clear()

            # Predict the keyword and associate it to a category. Then add to a 2D array with the associated category.
            # An example: [ ["Potato", "Vegetable"]  ["Banana", "Fruit"] ] 
            # First element is keyword, second is category.
            countNewChanges = 0

            for x in newArray[:]:
                category = [
                    x
                ]
                category_count = v.transform(category)
                model.predict(category_count)

                if model.predict(category_count) == [1]:
                    print(str(category) + " is an 'Current Asset'")
                    m.output.append(['"' +str(category[0]) + '": "','current asset"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','current asset'])
                        countNewChanges += 1

                if model.predict(category_count) == [2]:
                    print(str(category) + " is an 'Current Liability'")
                    m.output.append(['"' +str(category[0]) + '": "','current liability"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','current liability'])
                        countNewChanges += 1

                if model.predict(category_count) == [3]:
                    print(str(category) + " is an 'Equity'")
                    m.output.append(['"' +str(category[0]) + '": "','equity"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','equity'])
                        countNewChanges += 1

                if model.predict(category_count) == [4]:
                    print(str(category) + " is an 'Non-Current Asset'")
                    m.output.append(['"' +str(category[0]) + '": "','non-current asset"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','non-current asset'])
                        countNewChanges += 1

                if model.predict(category_count) == [5]:
                    print(str(category) + " is an Non-Current Liability")
                    m.output.append(['"' +str(category[0]) + '": "','non-current liability"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','non-current liability'])
                        countNewChanges += 1
                    
                X_test_count = v.transform(X_test)
                model.score(X_test_count, y_test)

            X_test_count = v.transform(X_test)
            print("The model is " + str(round((model.score(X_test_count, y_test)*100), 2)) + "% accurate.")
            print()
            print()

            *y,=map(list,{*map(tuple,m.output)})

            m.output = y
            
            # Turning array into JSON for front end
            li2 = [ y for x in m.output for y in x]

            getOutput = "{ \n"
            getOutput += ','.join(map(str,li2))


            regex = re.compile("[,']")
            getOutput = regex.sub('', getOutput)

            getOutput2 = ""
            for c in getOutput:
                getOutput2 += c 
                if c == '\n':
                    getOutput2 = getOutput2[:-1]
                    getOutput2 += ", \n"

            getOutput2 = getOutput2[:2] + getOutput2[3:]
            getOutput2 = getOutput2[:-3]
            getOutput2 += "\n }"

            # Create a JSON file so users can download the output
            file1 = open('./media/frontend/' +trainpic+'.json', 'w')
            file1.write(getOutput2)
            file1.close()

            machineLearning_data["Output"] = getOutput2 # Update output with JSON format

            # Update CSV file with a final row with number of changes
            with open("./media/" + trainpic,'a',newline='') as f:
                writer=csv.writer(f)
                writer.writerow([countNewChanges])

            results = ""

            # Read CSV and output it as a string
            with open("./media/" + trainpic) as csvfile:
                reader = csv.reader(csvfile, delimiter=',', quotechar='|') 
                for row in reader: # each row is a list
                    results += str(row) + "\n"

            results = results.replace('[', '')
            results = results.replace(']', '')
            results = results.replace("'", '')
            
            machineLearning_data["TrainingDataContent"] = str(results) 

            print("Copying file")
            shutil.copy2('./media/' + trainpic, './media/frontend') # Copy CSV file to front end folder

            # Clearing arrays and variables for next loop
            m.output.clear()
            getOutput2 = ""
            getOutput = ""
            newArray.clear()

            machineLearning_serializer = MachineLearningSerializer(data=machineLearning_data)
            if machineLearning_serializer.is_valid():
                machineLearning_serializer.save()
                return JsonResponse("Added Successfully!" , safe=False)

            

            return JsonResponse("Failed to Add.",safe=False)
    
        # OCR & Machine learning for Profit and Loss
        if typeSheet == "Profit and Loss":

            print("Profit and Loss Successful")

            # Loop through OCR words and clean the data
            for x in words:
                # Cleaning OCR data by getting rid of unnecessary symbols
                regex = re.compile('[^a-zA-Z -]')
                x = regex.sub('', x)
                x = x.strip()

                # More data cleaning
                if not x or x == " " or x == ", " or x == "," or len(x) <=  2 or x == "" or x.islower() == True: 
                    pass
                else:
                    # Add to an array of new words for cleaned data
                    x = x.replace(',', '')
                    x = x.replace('-', '')
                    newstring = ''.join([i for i in x if not i.isdigit()])
                    newArray.append(newstring)
            
            # More data cleaning, except we are cleaning words that are too similar to the account type.
            # This is so we don't end up with keywords that are actually ment to be category names
            for x in newArray[:]:

                x1 = x.lower()

                similarity = 0.90 # A similarity with a 90% or above will remove the word
                s1 = difflib.SequenceMatcher(None, x1, "Net (loss) surplus for the year").ratio()
                if s1 >= similarity:
                    if x in newArray:
                        newArray.remove(x)
                
                s2 = difflib.SequenceMatcher(None, x1, "Total comprehensive (loss) income for the year").ratio()
                if s2 >= similarity:
                    if x in newArray:
                        newArray.remove(x)


            # Machine Learning

            df = pd.read_csv("./media/" + trainpic) # Reading CSV from media file and putting it into df variable
            df.groupby('stdAccType').describe()
            df['type']=df['stdAccType'].apply(lambda x: 1 if x=='income' else (2 if x=='expense' else 0))
            df.sort_values(by=['keyword'])

            X, y = df.keyword.fillna(' '), df.type

            # SKlearn machine learning
            from sklearn.model_selection import train_test_split
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

            from sklearn.feature_extraction.text import CountVectorizer
            v = CountVectorizer()
            X_train_count = v.fit_transform(X_train.values)
            X_train_count.toarray()[:3]

            from sklearn.naive_bayes import MultinomialNB
            model = MultinomialNB()
            model.fit(X_train_count,y_train)

            m.output.clear()

            # Predict the keyword and associate it to a category. Then add to a 2D array with the associated category.
            # An example: [ ["Potato", "Vegetable"]  ["Banana", "Fruit"] ] 
            # First element is keyword, second is category.
            countNewChanges = 0

            for x in newArray[:]:
                category = [
                    x
                ]
                category_count = v.transform(category)
                model.predict(category_count)

                if model.predict(category_count) == [1]:
                    print(str(category) + " is an 'income'")
                    m.output.append(['"' +str(category[0]) + '": "','income"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','income'])
                        countNewChanges += 1

                if model.predict(category_count) == [2]:
                    print(str(category) + " is an 'expense'")
                    m.output.append(['"' +str(category[0]) + '": "','expense"' +"\n"])

                    # Update CSV with new training data
                    with open("./media/" + trainpic,'a',newline='') as f:
                        writer=csv.writer(f)
                        writer.writerow([str(category[0]),'NA','expense'])
                        countNewChanges += 1

                    
                X_test_count = v.transform(X_test)
                model.score(X_test_count, y_test)

            X_test_count = v.transform(X_test)
            print("The model is " + str(round((model.score(X_test_count, y_test)*100), 2)) + "% accurate.") # Print to console how accurate the model is
            print()
            print()

            *y,=map(list,{*map(tuple,m.output)})

            m.output = y
            
            # Turning array into JSON for front end
            li2 = [ y for x in m.output for y in x]

            getOutput = "{ \n"
            getOutput += ','.join(map(str,li2))

            regex = re.compile("[,']")
            getOutput = regex.sub('', getOutput)

            getOutput2 = ""
            for c in getOutput:
                getOutput2 += c 
                if c == '\n':
                    getOutput2 = getOutput2[:-1]
                    getOutput2 += ", \n"

            getOutput2 = getOutput2[:2] + getOutput2[3:]
            getOutput2 = getOutput2[:-3]
            getOutput2 += "\n }"

            # Create a JSON file so users can download the output
            file1 = open('./media/frontend/' +trainpic+'.json', 'w')
            file1.write(getOutput2)
            file1.close()

            machineLearning_data["Output"] = getOutput2 # Update output with JSON format
            
            # Update CSV file with a final row with number of changes
            with open("./media/" + trainpic,'a',newline='') as f:
                writer=csv.writer(f)
                writer.writerow([countNewChanges])

            results = ""

            # Read CSV and output it as a string
            with open("./media/" + trainpic) as csvfile:
                reader = csv.reader(csvfile, delimiter=',', quotechar='|') 
                for row in reader: # each row is a list
                    results += str(row) + "\n"

            results = results.replace('[', '')
            results = results.replace(']', '')
            results = results.replace("'", '')

            machineLearning_data["TrainingDataContent"] = str(results) 

            print("Copying file")
            shutil.copy2('./media/' + trainpic, './media/frontend') # Copy CSV file to front end folder

            # Resetting arrays and variables for next loop
            m.output.clear()
            getOutput2 = ""
            getOutput = ""
            newArray.clear()

            machineLearning_serializer = MachineLearningSerializer(data=machineLearning_data)
            if machineLearning_serializer.is_valid():
                machineLearning_serializer.save()
                return JsonResponse("Added Successfully!" , safe=False)

            

            return JsonResponse("Failed to Add.",safe=False)

        else:
            return JsonResponse("Failed to Add. No sheet selected",safe=False)
    
    elif request.method=='PUT':
        machineLearning_data = JSONParser().parse(request) 

        dataString = machineLearning_data["TrainingDataContent"] # dataString that holds training data content
        trainpic = machineLearning_data["TrainingDataFileName"] # trainpic that holds training data file name
        output = machineLearning_data["Output"] # output that holds the output
        
        lastNumber = re.search(r'\d+', dataString[::-1]).group()[::-1] # get last number of CSV file

        dataString = "\n".join(dataString.split("\n")[:-int(lastNumber)-1]) 

        # Open up training data file and remove the amount of lines that was listed at the end of the file
        f = open("./media/" + trainpic, "r+")
        lines = f.readlines()
        for x in range(int(lastNumber)+1):
            lines.pop()
        f = open("./media/" + trainpic, "w+")
        f.writelines(lines)


        data = json.loads(output)

        file1 = open('./media/frontend/' +trainpic+'.json', 'w')
        file1.write(output)
        file1.close()

        dataString += "\n"

        # Write to the training data file the new output
        for x in data:
            dataString += x + ", NA, " + data[x] + "\n"
            with open("./media/" + trainpic,'a',newline='') as f:
                writer=csv.writer(f)
                writer.writerow([x,'NA',data[x]])
        
        # Write the last number to the CSV file again
        with open("./media/" + trainpic,'a',newline='') as f:
            writer=csv.writer(f)
            writer.writerow([lastNumber,'',''])
            dataString += lastNumber + "\n"

        # Copy new training data into frontend
        print("Copying file")
        os.remove('./media/frontend/' + trainpic) # Remove old file
        shutil.copy2('./media/' + trainpic, './media/frontend') # Copy new file into folder

        machineLearning_data["TrainingDataContent"] = dataString # update TrainingDataContent with dataString 

        machineLearning=MachineLearning.objects.get(MachineLearningId=machineLearning_data['MachineLearningId'])
        machineLearning_serializer=MachineLearningSerializer(machineLearning,data=machineLearning_data)
        if machineLearning_serializer.is_valid():
            machineLearning_serializer.save()
            return JsonResponse("Updated Successfully!", safe=False)
        return JsonResponse("Failed to Update.", safe=False)

    elif request.method=='DELETE':
        machineLearning=MachineLearning.objects.get(MachineLearningId=id)
        machineLearning.delete()
        return JsonResponse("Deleted Successfully!", safe=False)

@csrf_exempt
def SaveFile(request):
    file=request.FILES['uploadedFile']
    file_name = default_storage.save(file.name,file)

    return JsonResponse(file_name,safe=False)