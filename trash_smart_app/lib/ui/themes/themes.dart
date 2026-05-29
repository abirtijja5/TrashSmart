import 'package:flutter/material.dart';

// Creation of themes
class CustomThemes {
  static TextStyle errorTextStyle = const TextStyle(
      fontSize: 20, color: Colors.red
  );
  static List<ThemeData> themes = [
    ThemeData(
        primarySwatch: Colors.lightBlue
    ),
    ThemeData(
        primarySwatch: Colors.deepOrange
    ),
    ThemeData(
        primarySwatch: Colors.indigo
    ),
    ThemeData(
        primarySwatch: Colors.amber
    ),
    ThemeData(
        primarySwatch: Colors.deepPurple
    ),
  ];
}