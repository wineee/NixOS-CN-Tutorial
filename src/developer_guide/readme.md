# 开发者手册

https://www.tweag.io/blog/2020-07-31-nixos-flakes/

makeWrapper and wrapProgram
Nix generally assumes run-time dependencies is a subset of the build-time dependencies.

This means many Nix builder functions try to automatically scan the output for runtime dependencies and "rewrite" them for runtime usage.

However shell scripts which are often exported by packages do not get this automatic scanning treatment.

This means you have to use the makeWrapper package and use either the makeWrapper or wrapProgram utility functions.

You may use them in the postFixup phase of a derivation:

postFixup = ''
  wrapProgram $out/bin/some-script \
    --set PATH ${lib.makeBinPath [
      coreutils
      findutils
      gnumake
      gnused
      gnugrep
    ]}
'';
We use the lib.makeBinPath to compose paths from a number of derivation outputs.

One should always try to use --set instead of --prefix because you shouldn't rely on the user profile environment variables.


### doesn't represent an absolute path
文件使用相对路径不要加括号

```nix
  # Import paths must be absolute. Path literals
  # are automatically resolved, so this is fine.
  (import ./foo.nix)

  # But this does not happen with strings.
  (import "./foo.nix")
  #=> error: string ‘foo.nix’ doesn't represent an absolute path
```


```
pkgs/desktops/mate/caja-extensions/default.nix

substituteInPlace open-terminal/caja-open-terminal.c --subst-var-by \
      GSETTINGS_PATH ${glib.makeSchemaPath "$out" "${pname}-${version}"}
```
```
  # postInstall = ''
  #   glib-compile-schemas "$out/share/glib-2.0/schemas"
  # '';

  preFixup = ''
    glib-compile-schemas ${glib.makeSchemaPath "$out" "${pname}-${version}"}
    qtWrapperArgs+=("''${gappsWrapperArgs[@]}")
  '';
```

103:For convenience, it also adds `dconf.lib` for a GIO module implementing a GSettings backend using `dconf`, `gtk3` for GSettings schemas, and `librsvg` for GdkPixbuf loader to the closure. There is also [`wrapGAppsHook4`]{#ssec-gnome-hooks-wrapgappshook4}, which replaces GTK 3 with GTK 4. And in case you are packaging a program without a graphical interface, you might want to use [`wrapGAppsNoGuiHook`]{#ssec-gnome-hooks-wrapgappsnoguihook}, which runs the same script as `wrapGAppsHook` but does not bring `gtk3` and `librsvg` into the closure.

