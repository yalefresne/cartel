import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  static const String _title = 'CartelTime';

  @override
  Widget build(BuildContext context) {
    return  MaterialApp(
      title: _title,
     theme:  ThemeData(
        primarySwatch: Colors.deepPurple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home:const MyStatefulWidget(),
    );
  }
}

class MyStatefulWidget extends StatefulWidget {
  const MyStatefulWidget({super.key});

  @override
  State<MyStatefulWidget> createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 1,
        backgroundColor: Colors.grey[200],
        leading: Container(
          margin: const EdgeInsets.all(10.0),
          child: const Icon(Icons.person)
        ),
        title: const Text(
          'Feeds',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: listOfTweets(),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.edit),
        onPressed: () {},
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            showButton(Icons.home, Colors.purple),
            showButton(Icons.search, Color.fromARGB(115, 190, 154, 154)),
            showButton(Icons.notifications, Color.fromARGB(115, 190, 154, 154)),
            showButton(Icons.mail_outline, Color.fromARGB(115, 190, 154, 154)),
          ],
        ),
      ),
    );
  }
  
  listOfTweets() {}
Widget showButton(IconData icon, Color color) {
    return IconButton(
      icon: Icon(
        icon,
        color: color,
      ),
      onPressed: () {},
    );
  }

}
