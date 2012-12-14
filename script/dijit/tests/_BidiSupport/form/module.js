dojo.provide("dijit.tests._BidiSupport.form.module");

try{
	doh.registerUrl("dijit.tests._BidiSupport.form.test_PlaceholderInput.", dojo.moduleUrl("dijit","tests/_BidiSupport/form/test_PlaceholderInput.html"));

	doh.registerUrl("dijit.tests._BidiSupport.form.multiSelect", dojo.moduleUrl("dijit", "tests/_BidiSupport/form/multiSelect.html"));

	doh.registerUrl("dijit.tests._BidiSupport.form.noTextDirTextWidgets", dojo.moduleUrl("dijit", "tests/_BidiSupport/form/noTextDirTextWidgets.html"));

	doh.registerUrl("dijit.tests._BidiSupport.form.Button", dojo.moduleUrl("dijit", "tests/_BidiSupport/form/Button.html"));

	doh.registerUrl("dijit.tests._BidiSupport.form.Select", dojo.moduleUrl("dijit", "tests/_BidiSupport/form/test_Select.html"));

	doh.registerUrl("dijit.tests._BidiSupport.form.Slider", dojo.moduleUrl("dijit", "tests/_BidiSupport/form/test_Slider.html"));

	var userArgs = window.location.search.replace(/[\?&](dojoUrl|testUrl|testModule)=[^&]*/g,"").replace(/^&/,"?");

	doh.registerUrl("dijit.tests._BidiSupport.form.robot.Textarea", dojo.moduleUrl("dijit","tests/_BidiSupport/form/robot/Textarea.html"+userArgs), 999999);
	
	doh.registerUrl("dijit.tests._BidiSupport.form.robot.SimpleComboBoxes", dojo.moduleUrl("dijit","tests/_BidiSupport/form/robot/SimpleComboBoxes.html"+userArgs), 999999);

	doh.registerUrl("dijit.tests._BidiSupport.form.robot.SimpleTextarea", dojo.moduleUrl("dijit","tests/_BidiSupport/form/robot/SimpleTextarea.html"+userArgs), 999999);

	doh.registerUrl("dijit.tests._BidiSupport.form.robot.TextBoxes", dojo.moduleUrl("dijit","tests/_BidiSupport/form/robot/TextBoxes.html"+userArgs), 999999);
	
	doh.registerUrl("dijit.tests._BidiSupport.form.robot.InlineEditBox", dojo.moduleUrl("dijit","tests/_BidiSupport/form/robot/InlineEditBox.html"+userArgs), 999999);
}catch(e){

	doh.debug(e);

}
