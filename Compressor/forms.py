from django import forms

class dropBox(forms.Form):
    CHOICES = [
        ("op1", "placeHolder1"),
        ("op2", "placeHolder2"),
        ("op3", "placeHolder3"),
    ]
    dropbx = forms.ChoiceField(choices=CHOICES, label="choose a value")



