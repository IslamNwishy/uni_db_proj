from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from helper import *


app = Flask(__name__)
############# Database Credientials ################
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '*******'
app.config['MYSQL_DATABASE_DB'] = 'db_project'
mysql = MySQL()
mysql.init_app(app)


@app.route('/login', methods=['POST'])
def login():
    query = "SELECT * FROM student WHERE ID=%s"
    if(request.method == "POST"):
        success, data = Fetch(mysql, query, request.get_json()["SID"], False)
        if success:
            data = [val for sublist in data for val in sublist]
        if not data:
            success = False
        ret = {"success": str(success), "student": data}
        return jsonify(ret)


@app.route('/register', methods=['POST'])
def register():
    query = "INSERT INTO student(ID,SName,Standing,DName) VALUES (%s,%s,%s,%s)"
    success = True
    Msg = "Student Added Successfully"

    if(request.method == "POST"):
        student = request.get_json()
        if student['department'] == "null":
            student['department'] = None
        args = (student['SID'], student['name'],
                student['standing'], student['department'])

        success, data = Commit(mysql, query, args)
        if not success:
            Msg = data

    ret = {"success": str(success), "Msg": Msg}
    return jsonify(ret)


@app.route('/depts', methods=['POST'])
def depts():
    query = "SELECT * FROM department"
    if(request.method == "POST"):
        success, data = Fetch(mysql, query, None, False)
        data = [val for sublist in data for val in sublist]
        ret = {"success": str(success), "depts": data}
        return jsonify(ret)


@app.route('/prefix', methods=['POST'])
def prefix():
    query = "SELECT * FROM prefix"
    success, data = Fetch(mysql, query, None, True)
    ret = {"success": str(success), "Prefixes": data}
    return jsonify(ret)


@app.route('/Courses', methods=['POST'])
def Courses():

    query = "SELECT c.*, l.PCode_2, l.Code4_2, r.PCode_Req, r.Code4_Req FROM course c left outer join cross_list l on c.PCode = l.PCode_1 and c.Code4 = l.Code4_1 left outer join courseprereq r on c.PCode = r.PCode_Parent and c.Code4 = r.Code4_Parent WHERE PCode=%s"
    data = []

    success, items = Fetch(mysql, query, request.get_json(), True)
    if success:
        data = connectPrereq(items)

    ret = {"success": str(success), "Courses": data}
    return jsonify(ret)


@app.route('/availCourses', methods=['POST'])
def availCourses():
    query = "SELECT c.*, l.PCode_2, l.Code4_2, r.PCode_Req, r.Code4_Req FROM course c left outer join cross_list l on c.PCode = l.PCode_1 and c.Code4 = l.Code4_1 left outer join courseprereq r on c.PCode = r.PCode_Parent and c.Code4 = r.Code4_Parent WHERE c.PCode=%s and( (c.PCode, c.Code4) IN (SELECT q.PCode_Parent, q.Code4_Parent from coursetaken t inner join courseprereq q on t.PCode=q.PCode_Req and t.Code4=q.Code4_Req where t.ID=%s) or (c.PCode, c.Code4) NOT IN (select PCode_Parent, Code4_Parent from courseprereq ));"
    data = []
    args = (request.get_json()["pcode"], request.get_json()["ID"])
    success, items = Fetch(mysql, query, args, True)

    if success:
        data = connectPrereq(items)

    ret = {"success": str(success), "Courses": data}
    return jsonify(ret)


@app.route('/insertCourses', methods=['POST'])
def insertCourses():
    query = "INSERT INTO coursetaken(ID,PCode,Code4,Grade) VALUES(%s,%s,%s,%s)"

    inData = request.get_json()
    ID = inData["ID"]
    Courses = inData["Courses"]

    i = 0
    for course in Courses:
        name = course["course"].split(" ")
        args = (ID, name[0], name[1], course["grade"])
        success, data = Commit(mysql, query, args)
        if success:
            i += 1

    ret = {"success": str(success), "left": len(Courses) - i}
    return jsonify(ret)


@app.route('/Reviews', methods=['POST'])
def Reviews():
    query = "SELECT PCode, Code4, Code3, CName, Credits FROM course WHERE PCode=%s"
    query2 = "SELECT * FROM review WHERE PCode=%s"
    query3 = "SELECT ID FROM coursetaken WHERE  ID=%s and PCode=%s and Code4=%s"
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    success = True
    data = []
    try:
        cursor.execute(query, request.get_json())
        data = cursor.fetchall()
        cursor.execute(query2, request.get_json())
        data2 = cursor.fetchall()
        if data2:
            for i in data2:
                for j in range(0, len(data)):

                    if data[j]["Code4"] == i["Code4"]:
                        cursor.execute(
                            query3, (i["ID"], i["PCode"], i["Code4"]))
                        verified = False
                        if cursor.fetchall():
                            verified = True

                        if "Review" in data[j].keys():
                            data[j]["Review"].append({
                                "Rate": i["Rating"],
                                "Text": i["TextReview"],
                                "ID": i["ID"],
                                "Verified": verified, })
                        else:
                            data[j]["Review"] = [{
                                "Rate": i["Rating"],
                                "Text": i["TextReview"],
                                "ID": i["ID"],
                                "Verified": verified, }]

                        print(data[j])

    except Exception as error:
        success = False
        print(error)

    cursor.close()
    conn.close()
    ret = {"success": str(success), "Reviews": data}
    return jsonify(ret)


@app.route('/insertReview', methods=['POST'])
def insertReview():
    query = "INSERT INTO review(ID, PCode, Code4, Rating, TextReview) VALUES(%s,%s,%s,%s,%s)"

    InData = request.get_json()
    args = (InData["ID"], InData["pcode"], InData["code4"],
            InData["rating"], InData["text"])
    success, data = Commit(mysql, query, args)
    ret = {"success": str(success), "Msg": data}
    return jsonify(ret)
