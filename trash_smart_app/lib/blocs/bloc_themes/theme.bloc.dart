// Bloc
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:trash_smart_app/blocs/bloc_themes/theme.event.dart';
import 'package:trash_smart_app/blocs/bloc_themes/theme.state.dart';

import '../../ui/themes/themes.dart';

class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  int currentThemeIndex = 0;
  List<ThemeData> themes = CustomThemes.themes;
  ThemeBloc() : super(InitialThemeState()) {
    on((SwitchThemeEvent event, emit){
      ++currentThemeIndex;
      if(currentThemeIndex >= themes.length) {
        currentThemeIndex = 0;
      }
      emit(ThemeSuccessState(themeData: themes[currentThemeIndex]));
    });
  }

}

