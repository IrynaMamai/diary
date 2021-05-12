import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, IconButton, TextInput, FAB, Appbar, Title, RadioButton, Snackbar } from 'react-native-paper'

import { useSelector, useDispatch } from 'react-redux'
import styled, { ThemeProvider } from "styled-components"
import { switchTheme } from "../reducer/themeAction"
import { lightTheme, darkTheme, yellowTheme } from '../theme/Theme'

import { useTranslation } from 'react-i18next'
import '../translete/i18n'


function Settings({ navigation }) {
    const { t, i18n } = useTranslation();

    const notes = navigation.getParam('note');
    console.log(notes);

    const theme = useSelector((state) => state.themeReducer.theme)
    const dispatch = useDispatch();


    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    post = () => {
        notes.forEach(note => {
            const qwe = {
                title: note.title,
                description: note.description,
                date: note.date,
                url: note.url
            }
            get_data(qwe);
        })
    }

    function get_data(note) {
        return new Promise((resolve, reject) => {
            fetch('https://parseapi.back4app.com/classes/qwerty', {
                method: "POST",
                headers: {
                    "X-Parse-Application-Id": "fmqpxR7p84DbefGfT5qbWgxXT2kahDVbb5Y68vib",
                    "X-Parse-REST-API-Key": "Frh8CziZDBVgFaEvaNO2r649LX79FWjOSkf0pU31",
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(note)
            })
                .then(response => response.json())
                .then(res => {
                    if (res.status = 200 && res.length != 0) {
                        resolve(res)
                        onToggleSnackBar();
                        // console.log(res)
                        // console.log("Yes");
                    } else {
                        //console.log("No");
                        reject(res)
                    }
                })
        })
    }




    return (
        <ThemeProvider theme={theme}>
            <Appbar.Header style={{ backgroundColor: theme.PRIMARY_HEADER_COLOR }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={t("~ settings ~")} />
            </Appbar.Header>

            <Cont>
                <Text style={{ paddingLeft: 25, fontSize: 22, color: theme.PRIMARY_TEXT_COLOR }}>{t("Settings theme")}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>

                    <TouchableOpacity onPress={() => dispatch(switchTheme(lightTheme))} style={{
                        backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR,
                        borderColor: lightTheme.PRIMARY_HEADER_COLOR, borderRadius: 2, borderWidth: 2, width: 90, height: 30, marginLeft: 15
                    }}>
                        <TextButton>{t("Ligth")}</TextButton>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => dispatch(switchTheme(darkTheme))} style={{
                        backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR,
                        borderColor: darkTheme.PRIMARY_BUTTON_COLOR, borderRadius: 2, borderWidth: 2, width: 90, height: 30, marginLeft: 15
                    }}>
                        <TextButton>{t("Dark")}</TextButton>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => dispatch(switchTheme(yellowTheme))} style={{
                        backgroundColor: theme.PRIMARY_CONTAINER_BACKGROUND_COLOR,
                        borderColor: yellowTheme.PRIMARY_HEADER_COLOR, borderRadius: 2, borderWidth: 2, width: 90, height: 30, marginLeft: 15
                    }}>
                        <TextButton>{t("Yellow")}</TextButton>
                    </TouchableOpacity>

                </View>



                <Text style={{ paddingLeft: 25, paddingTop: 25, fontSize: 22, color: theme.PRIMARY_TEXT_COLOR }}>{t("Settings language")}</Text>

                <View style={{ padding: 10 }}>

                    <Button onPress={() => i18n.changeLanguage('en')}>
                        <TextButton>{t("English")}</TextButton>
                    </Button>

                    <Button onPress={() => i18n.changeLanguage('sk')}>
                        <TextButton>{t("Slovak")}</TextButton>
                    </Button>

                    <Button onPress={() => i18n.changeLanguage('ru')}>
                        <TextButton>{t("Russian")}</TextButton>
                    </Button>

                </View>


                <Server onPress={() => post()}>
                    <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>{t("Send to server")}</Text>
                </Server>

                <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={500}>
                    {t("Operation successful")}
                </Snackbar>

            </Cont>

        </ThemeProvider>
    )
}

const Cont = styled.View`
    flex: 1;
    background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
    padding-top: 20px;
  `;

const TextButton = styled.Text`
    text-align: center;
    font-size: 18px;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  `;

const Button = styled.TouchableOpacity`
    background-color: ${props => props.theme.PRIMARY_CONTAINER_BACKGROUND_COLOR};
    border-color: ${props => props.theme.PRIMARY_BUTTON_COLOR};
    border-radius: 2px;
    border-width: 2px;
    width: 115px;
    height: 30px;
    margin-left: 15px;
    margin-bottom: 15px;

  `;

const Server = styled.TouchableOpacity`
    background-color: ${props => props.theme.PRIMARY_BUTTON_COLOR};
    padding-top: 75px;
    padding-bottom: 75px;
    margin-top: 35px;
    border-radius: 255px;
    margin-right: 90px;
    margin-left: 90px;
    justify-content: center;
`;


export default Settings