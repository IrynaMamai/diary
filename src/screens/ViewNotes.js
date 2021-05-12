import React, { useState } from 'react'
import { StyleSheet, View, FlatList, Image, TouchableOpacity, ScrollView, Text } from 'react-native'
import { FAB, List, Appbar, Title, Card, Paragraph } from 'react-native-paper'

import { connect } from 'react-redux'
import styled, { ThemeProvider } from "styled-components"

import * as SQLite from 'expo-sqlite'





// ****************
// expo build:android
// ****************
// аунтификация
// языки
// настройки


const db = SQLite.openDatabase('db.Diary')


class ViewNotes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }

    // Check if the items table exists if not create it
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, url TEXT, date INTEGER NOT NULL )'
      )
      console.log('table created');
    })
    this.fetchData() // ignore it for now

  }

  fetchData = () => {
    db.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM notes', null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => this.setState({ data: _array })
        // failure callback which sends two things Transaction object and Error

      ) // end executeSQL
    }) // end transaction


  }

  addNote = note => {
    const date = new Date();
    const dateNote = date.getFullYear() * 10000000000 + (date.getMonth() + 1) * 100000000 + date.getDate() * 1000000 + date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds();

    db.transaction(tx => {
      tx.executeSql('INSERT INTO notes (title,  description, url, date) values (?, ?, ?, ?)', [note.noteTitle, note.noteDescription, note.url, dateNote],
        (txObj, resultSet) => this.setState({
          data: this.state.data.concat(
            { id: resultSet.insertId, title: note.noteTitle, description: note.noteDescription, url: note.url, date: dateNote }).sort((a, b) => a.date < b.date ? 1 : -1)
        }),
        (txObj, error) => console.log('Error', error))
    })




  }

  editNote = note => {
    const date = new Date();
    const dateNote = date.getFullYear() * 10000000000 + (date.getMonth() + 1) * 100000000 + date.getDate() * 1000000 + date.getHours() * 10000 + date.getMinutes() * 100 + date.getSeconds();


    db.transaction(tx => {
      tx.executeSql('UPDATE notes SET title = ?, description = ?, url = ?, date = ?  WHERE id = ?', [note.title, note.description, note.url, dateNote, note.id],
        (txObj, resultSet) => {

          if (resultSet.rowsAffected > 0) {

            let newList = this.state.data.map(data => {
              if (data.id === note.id) {

                return { ...data, title: data.title, description: data.description, url: data.url, date: dateNote }
              } else {
                return data
              }

            })
            this.setState({ data: newList = [].concat(newList).sort((a, b) => a.date < b.date ? 1 : -1) })


          }
        })
    })


  }

  deleteNote = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM notes WHERE id = ? ', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let newList = this.state.data.filter(data => {
              if (data.id === id)
                return false
              else
                return true
            })
            this.setState({ data: newList })
          }
        })
    })
  }

  isImageNotNull = (url) => {
    if (url) {
      return (

        <Card.Cover style={{ height: 80 }} source={{ uri: url }} />

      )
    }
  }


  render() {

    return (
      <ThemeProvider theme={this.props.theme}>

        <Appbar.Header style={{ backgroundColor: this.props.theme.PRIMARY_HEADER_COLOR }}>
          <Appbar.Content title="   ~ 📖 ~" />       
          <Appbar.Action icon="settings" onPress={() => this.props.navigation.navigate('Settings', {note: this.state.data})} />
        </Appbar.Header>

        <Container>
          <View >
            <ScrollView>
              {
                this.state.data && this.state.data.map(data =>
                  (
                    <Note key={data.id}>

                      <Card onPress={() => this.props.navigation.navigate('OpenNote', { deleteNote: this.deleteNote, editNote: this.editNote, note: data })}>

                        {this.isImageNotNull(data.url)}

                        <Card.Content style={{ backgroundColor: this.props.theme.PRIMARY_CONTAINER_BACKGROUND_COLOR, flexDirection: "row", height: 60, }}>

                          <DateNote>
                            <Paragraph style={{ color: this.props.theme.PRIMARY_TEXT_COLOR }}>{Math.floor(data.date % 100000000 / 1000000)}/{Math.floor(data.date % 10000000000 / 100000000)}/{Math.floor(data.date % 1000000000000 / 10000000000)}</Paragraph>
                            <Paragraph style={{ color: this.props.theme.PRIMARY_TEXT_COLOR }}>{Math.floor(data.date % 1000000 / 10000)}:{Math.floor(data.date % 10000 / 100) < 10 ? "0" : ""}{Math.floor(data.date % 10000 / 100)}</Paragraph>

                          </DateNote>

                          <View style={{ paddingLeft: 10 }}>
                            <Title style={{ color: this.props.theme.PRIMARY_TEXT_COLOR }} numberOfLines={1}>{data.title}</Title>
                            <Paragraph numberOfLines={1} style={{ color: this.props.theme.PRIMARY_TEXT_COLOR, marginTop: -4 }}>{data.description}</Paragraph>
                          </View>

                        </Card.Content>

                      </Card>

                    </Note>


                  )
                )}
            </ScrollView>
          </View>


          <FAB
            style={{ backgroundColor: this.props.theme.PRIMARY_BUTTON_COLOR, position: 'absolute', margin: 20, right: 0, bottom: 10 }}
            small
            icon='plus'
            onPress={() => this.props.navigation.navigate('AddNotes', { addNote: this.addNote })}
          />

        </Container>

      </ThemeProvider>

    )
  }

}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  padding-vertical: 20px;
  padding-horizontal: 10px;
  `;

const Note = styled.View`
  margin-bottom: 30px;
`;

const DateNote = styled.View`
  border-color: ${props => props.theme.PRIMARY_BORDER_COLOR};
  border-radius: 2px;
  border-width: 1px;
  width: 80px;
  margin-left: -11px; 
  padding-left: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 50px;
`;



const mapStateToProps = (state) => {
  return {
    theme: state.themeReducer.theme
  }
}

export default connect(mapStateToProps)(ViewNotes);