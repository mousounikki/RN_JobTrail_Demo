import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Button,
	Alert
} from 'react-native';

const SERVER_URL = 'http://117.27.141.20:3000/';
const TASK_API = 'tasks/';

export default class detail extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			taskID: '' + this.props.task.id,
			taskTitle: this.props.task.title,
			taskSubTitle: this.props.task.subTitle,
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={this._pressBackButton.bind(this)}>
					<Text style={styles.back}>返回</Text>
				</TouchableOpacity>

				<View style={styles.line}>
					<Text style={styles.text}>任务ID:</Text>
					<TextInput style={styles.input} 
					value={this.state.taskID} onChangeText={(text) => {this.setState({taskID:text});
					}}></TextInput>
				</View>

				<View style={styles.line}>
					<Text style={styles.text}>任务名称:</Text>
					<TextInput style={styles.input} 
					value={this.state.taskTitle} onChangeText={(text) => {this.setState({taskTitle:text});
				}}></TextInput>
				</View>
					
				<View style={styles.line}>
					<Text style={styles.text}>任务描述:</Text>
					<TextInput style={styles.input}
					value={this.state.taskSubTitle} onChangeText={(text) => {
						this.setState({taskSubTitle:text});
					}}></TextInput>
				</View>


				<Button title='新建' onPress={this._createTask}></Button>
				<Button title='保存' onPress={this._updateTask}></Button>
				<Button title='删除' onPress={this._deleteTask}></Button>
 
			</View>
		);
	}

	_pressBackButton() {
		const {navigator} = this.props;
		if (navigator) {
			navigator.pop();
		}
	}

	//修改任务
	_updateTask = () => {
		const req = new Request( SERVER_URL + TASK_API + this.state.taskID, {
			method:'PUT',
			headers: { // 设置HTTP请求头的数据格式为JSON
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body:JSON.stringify({
				'id':parseInt(this.state.taskID),
				'title':this.state.taskTitle,
				'subTitle':this.state.taskSubTitle,
				'image': this.props.task.image,
			})
		});
		fetch(req).then((res) => {
			return res.json();
		}).then((result,done) => {
			if (!done) {
				this.props.taskUpdated();//通知home组件列表信息更新
				Alert.alert('任务保存成功',null,null);
			} else {
				Alert.alert('任务保存失败，请重试',null,null);
			}
		});
	}

	//新建待办任务
	_createTask = () => {
		const req = new Request(SERVER_URL + TASK_API,{
			method:'POST',
			headers:{
				'Accept':'application/json',
				'Content-Type':'application/json',
			},
			body:JSON.stringify({
				'id':parseInt(this.state.taskID),
				'title':this.state.taskTitle,
				'subTitle':this.state.taskSubTitle,
				'image': this.props.task.image,
			})

		});
		fetch(req).then((res) => {
			return res.json();
		}).then((result,done) => {
			if (!done) {
				this.props.taskUpdated();
				Alert.alert('待办任务创建成功',null,null);			
			} else {
				Alert.alert('任务创建失败，请重试',null,null);
			}
		});
	}

	_deleteTask = () => {
		const req = new Request( SERVER_URL + TASK_API + this.state.taskID,{
			method:'DELETE'
		});
		fetch(req).then((res) => {
			return res;
		}).then((result,done) => {
			if (!done) {
				this.props.taskUpdated();
				Alert.alert('任务删除成功',null,null);
			} else {
				Alert.alert('任务删除失败',null,null);
			}
		})
	}


}


		

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop:100,
	},
	line:{
		flexDirection:'row'
	},
	text: {
		width:100,
		fontSize: 20
	},
	back: {
		fontSize: 20,
		color: 'blue'
	},
	input: {
		flex:1,
	    borderColor:'gray',
		borderWidth:2
	},

});
