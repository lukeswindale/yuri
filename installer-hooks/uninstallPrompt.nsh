!macro customUnInstall

  MessageBox MB_YESNO|MB_ICONQUESTION "Would you like to remove your custom protocol registrations and actions?" IDYES remove IDNO skip

  remove:
    DeleteRegKey HKCU "Software\Classes\lingo"
    DeleteRegKey HKCU "Software\Classes\yuri"
    DeleteRegKey HKCU "Software\Classes\myapp"
    Goto done

  skip:
    SetShellVarContext all
    StrCpy $0 "$PROFILE\Desktop\Yuri-Uninstall-Instructions.txt"
    FileOpen $1 $0 w
    FileWrite $1 "To manually remove Yuri's custom URI protocols, delete registry keys under:\r\n"
    FileWrite $1 "  HKEY_CURRENT_USER\Software\Classes\[your-protocol-name]\r\n"
    FileWrite $1 "Use 'regedit' with caution, or run 'reg delete' from the command line.\r\n"
    FileWrite $1 "Example: reg delete HKCU\Software\Classes\lingo\r\n"
    FileClose $1
    MessageBox MB_OK "Instructions have been saved to your Desktop."

  done:

!macroend
