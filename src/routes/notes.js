const express = require('express');
const router = express.Router();

const Note = require('../models/Note'); //Ingresando a la caprtea models/notes para obtener el modelo
const { isAuthenticated } = require('../helpers/auth');


router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const errors = [];
    if(!title){
        errors.push({text: 'Please write a Title.'});
    } 
    if(!description){
        errors.push({text: 'Please, write a descripcion'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }else {
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save(); //await quiere decir que va esperar a que termine de guardar la nosta en la BD y luego continuar
        req.flash('success_msg', 'Note has been added')
        res.redirect('/notes')
    }
   
});//aqui, resive a esta direccion la peticion

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes })
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note})
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note has been updated');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note has been Deleted');
    res.redirect('/notes');
});

module.exports = router;