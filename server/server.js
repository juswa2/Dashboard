import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

const photoStorage = multer.diskStorage({
    destination: (req, photo, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, photo, cb) => {
        cb(null, photo.fieldname + "_" + Date.now() + path.extname(photo.originalname));
    }
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const filesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const uploadPhoto = multer({ storage: photoStorage });
const uploadFile = multer({ storage: fileStorage });
const uploadFiles = multer({ storage: filesStorage });
const uploadFiless = multer({ storage: fileStorage });
const uploadFilesss = multer({ storage: fileStorage });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'quilatondb'
})

app.post('/fileupload', uploadFile.single('client_file'), (req, res) => {
    const clientcaseId = req.body.clientcaseId;
    const file = req.file.filename;
    res.json({ status: 'Success', clientcaseId: clientcaseId, fileName: file });
});

app.post('/fileuploads', uploadFiles.single('file'), (req, res) => {
    const clientcaseId = req.body.clientcaseId;
    const file = req.file.filename;
    res.json({ status: 'Success', clientcaseId: clientcaseId, fileName: file });
});

app.post('/fileuploadss', uploadFiless.single('retainer_file'), (req, res) => {
    const retainercaseId = req.body.retainercaseId;
    const file = req.file.filename;
    res.json({ status: 'Success', retainercaseId: retainercaseId, fileName: file });
});

app.post('/fileuploadsss', uploadFilesss.single('file'), (req, res) => {
    const retainercaseId = req.body.retainercaseId;
    const file = req.file.filename;
    res.json({ status: 'Success', retainercaseId: retainercaseId, fileName: file });
});

app.post('/photoupload', uploadPhoto.single('image'), (req, res) => {
    const accountId = req.body.accountId;
    const image = req.file.filename;
    const sql = "UPDATE accounts SET image = ? WHERE id = ?";
    db.query(sql, [image, accountId], (err, result) => {
        if (err) return res.json({ status: "Error" });
        return res.json({ status: "Success" });
    })
})

app.put('/updateaccount/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, middle_name, last_name, suffix, username, email, pnumber, fb, password, account_type } = req.body;

    console.log("Updated account data:", req.body);

    const sql = 'UPDATE accounts SET first_name=?, middle_name=?, last_name=?, suffix=?, username=?, email=?, pnumber=?, fb=?, password=?, account_type=? WHERE id=?';
    db.query(sql, [first_name, middle_name, last_name, suffix, username, email, pnumber, fb, password, account_type, id], (err, result) => {
        if (err) {
            console.error("Error updating account:", err);
            return res.status(500).json({ error: "Error updating account" });
        }
        return res.json({ success: true, message: "Account updated successfully" });
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM accounts Where id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.delete('/Sdelete/:id', (req, res) => {
    const sql = "DELETE FROM client_statuses Where id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.delete('/Rdelete/:id', (req, res) => {
    const sql = "DELETE FROM retainer_statuses Where id =?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/', (req, res) => {
    const sql = "SELECT * FROM accounts";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result);
    })
})

app.get('/viewaccount/:id', (req, res) => {
    const sql = "SELECT * FROM accounts WHERE id = ?";
    const id = req.params.id;

    db.query(sql,[id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result[0]);
    })
})

app.get('/clientcaseinfo/:id', (req, res) => {
    const sql = "SELECT * FROM client_case WHERE id = ?";
    const id = req.params.id;

    db.query(sql,[id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result[0]);
    })
})

app.get('/clientinfo/:id', (req, res) => {
    const sql = "SELECT * FROM accounts WHERE id = ?";
    const id = req.params.id;

    db.query(sql,[id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result[0]);
    })
})

app.get('/retainerinfo/:id', (req, res) => {
    const sql = "SELECT * FROM accounts WHERE id = ?";
    const id = req.params.id;

    db.query(sql,[id], (err, result) => {
        if (err) return res.json({ Message: "Error inside server" });
        return res.json(result[0]);
    })
})

app.post('/accounts', (req, res) => {
    const sql = "INSERT INTO accounts (first_name, middle_name, last_name, suffix, username, email, pnumber, fb, password, account_type) VALUES (?)";
    const values = [
        req.body.first_name,
        req.body.middle_name,
        req.body.last_name,
        req.body.suffix,
        req.body.username,
        req.body.email,
        req.body.pnumber,
        req.body.fb,
        req.body.password,
        req.body.account_type,
    ];
    db.query(sql, [values], (err, result) => {
        if (err) return res.json({ status: "Error" });
        return res.json({ status: "Success", id: result.insertId });
    });
});

app.post('/addcase', uploadFile.single('client_file'), (req, res) => {
    const { case_title, client_status, date, client_id } = req.body;
    const file = req.file.filename;
    const sql = "INSERT INTO client_case (case_title, client_status, client_file, date, client_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [case_title, client_status, file, date, client_id], (err, result) => {
        if (err) {
            console.error("Error adding case:", err);
            return res.json({ status: "Error" });
        }
        return res.json({ status: "Success", id: result.insertId });
    });
});

app.post('/addclientstatus', uploadFiles.single('file'), (req, res) => {
    const { status, date, client_case_id } = req.body;
    const file = req.file.filename;
    const sql = "INSERT INTO client_statuses ( status, file, date, client_case_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [ status, file, date, client_case_id], (err, result) => {
        if (err) {
            console.error("Error adding case:", err);
            return res.json({ status: "Error" });
        }
        return res.json({ status: "Success", id: result.insertId });
    });
});

app.post('/addretainerstatus', uploadFilesss.single('file'), (req, res) => {
    const { status, date, retainer_case_id } = req.body;
    const file = req.file.filename;
    const sql = "INSERT INTO retainer_statuses ( status, file, date, retainer_case_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [ status, file, date, retainer_case_id], (err, result) => {
        if (err) {
            console.error("Error adding case:", err);
            return res.json({ status: "Error" });
        }
        return res.json({ status: "Success", id: result.insertId });
    });
});

  app.get('/retainerstatuses/:retainer_case_id', (req, res) => {
    const retainer_case_id = req.params.retainer_case_id;

    const sql = "SELECT * FROM retainer_statuses WHERE retainer_case_id = ?";
    db.query(sql, [retainer_case_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No statuses found for the given client case ID" });
        }
        return res.json(result);
    });
});
  
  app.get('/clientstatuses/:client_case_id', (req, res) => {
    const client_case_id = req.params.client_case_id;

    const sql = "SELECT * FROM client_statuses WHERE client_case_id = ?";
    db.query(sql, [client_case_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No statuses found for the given client case ID" });
        }
        return res.json(result);
    });
});


  app.get('/clientcase/:client_id', (req, res) => { 
    const client_id = req.params.client_id;

    const sql = "SELECT * FROM client_case WHERE client_id = ?";
    db.query(sql, [client_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No client cases found for the given client ID" });
        }
        return res.json(result);
    });
});

app.post('/addretainercase', uploadFiless.single('retainer_file'), (req, res) => {
    const { case_title, retainer_status, date, retainer_id } = req.body;
    const file = req.file.filename;
    const sql = "INSERT INTO retainer_case (case_title, retainer_status, retainer_file, date, retainer_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [case_title, retainer_status, file, date, retainer_id], (err, result) => {
        if (err) {
            console.error("Error adding case:", err);
            return res.json({ status: "Error" });
        }
        return res.json({ status: "Success", id: result.insertId });
    });
});

app.get('/retainercase/:retainer_id', (req, res) => { 
    const retainer_id = req.params.retainer_id;

    const sql = "SELECT * FROM retainer_case WHERE retainer_id = ?";
    db.query(sql, [retainer_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "No retainer cases found for the given retainer ID" });
        }
        return res.json(result);
    });
});

app.put('/updatecase/:id', (req, res) => {
    const { client_status, date } = req.body;
    const id = req.params.id;
    
    const sql = "UPDATE client_case SET client_status=?, date=? WHERE id=?";
    const values = [client_status, date, id];
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating case:", err);
        return res.json({ status: "Error" });
      }
      return res.json({ status: "Success" });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM accounts where `username` = ? AND `password` = ?";
    db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if(err) {
            console.error("Error in login:", err);
            return res.json({error: "Error in login"});
        }
        if(result.length > 0) {
            req.session.account_type = result[0].account_type;
            req.session.first_name = result[0].first_name;
            req.session.middle_name = result[0].middle_name;
            req.session.last_name = result[0].last_name;
            console.log("Login successful. Account type:", result[0].account_type);
            return res.json({ Login: true, account_type: result[0].account_type });
        } else {
            console.log("No account found");
            return res.json({ Login: false, Message: "No account found" });
        }
        
    });
});

app.get('/checkSession', (req, res) => {
    if (req.session && req.session.user) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.get('/session', (req, res) => {
    if(req.session.account_type) {
        const userData = {
            account_type: req.session.account_type,
            id: req.session.id,
            first_name: req.session.first_name,
            middle_name: req.session.middle_name,
            last_name: req.session.last_name
        };
        return res.json({ valid: true, userData: userData });
    } else {
        return res.json({ valid:false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    return res.json("success");
})


app.use('/files', express.static(path.join(__dirname, 'public', 'files')));

app.listen(8081, () => {
    console.log("Server is running");
})
