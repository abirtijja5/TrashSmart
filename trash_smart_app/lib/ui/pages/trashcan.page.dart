import 'package:flutter/material.dart';

class TrashCanPage extends StatelessWidget {
  const TrashCanPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar(title: const Text("Trashcan Page"),),
      body:  Center(
        child: Text("Trashcan Page", style: Theme.of(context).textTheme.headline5,),
      ),
    );
  }

}
