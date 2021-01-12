import pymysql


def Fetch(mysql, query, params, dict):
    conn = mysql.connect()
    if dict:
        cursor = conn.cursor(pymysql.cursors.DictCursor)
    else:
        cursor = conn.cursor()

    try:
        cursor.execute(query, params)
    except Exception as error:
        cursor.close()
        conn.close()
        return False, str(error)

    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return True, data


def Commit(mysql, query, params):
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        cursor.execute(query, params)
        conn.commit()
    except Exception as error:
        print(error)
        cursor.close()
        conn.close()
        return False, str(error)

    cursor.close()
    conn.close()
    return True, None


def connectPrereq(items):
    d = {}
    for i in items:
        key = i["PCode"] + i["Code4"]
        if key in d:
            d[key]["PCode_Req"] += "," + \
                i["PCode_Req"] + " " + i["Code4_Req"]

        else:
            d[key] = i
            if d[key]["PCode_Req"]:
                d[key]["PCode_Req"] += " " + i["Code4_Req"]

    return list(d.values())
