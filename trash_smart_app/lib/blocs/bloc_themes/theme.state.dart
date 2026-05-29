// State
import 'package:flutter/material.dart';

import '../../ui/themes/themes.dart';

abstract class ThemeState {
  late ThemeData themeData;

  ThemeState({required this.themeData,
  });
}

class ThemeSuccessState extends ThemeState {
  ThemeSuccessState({required super.themeData});
}

class InitialThemeState extends ThemeState {
  InitialThemeState() : super(
      themeData : CustomThemes.themes[0]
  );
}