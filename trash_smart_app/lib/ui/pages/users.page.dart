import 'package:flutter/material.dart';

class UsersPage extends StatelessWidget {
  const UsersPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar(title: const Text("Users Page"),),
      body:  Center(
        child: Text("Users Page", style: Theme.of(context).textTheme.headline5,),
      ),
    );
  }
}
