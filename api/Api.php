<?php
/**
 * Пример работы с API
 *
 * Created by PhpStorm.
 * User: root
 * Date: 16.03.16
 * Time: 11:26
 */

namespace app\controllers;

use app\models\Position;
use app\models\User;
use app\models\Users;
use yii\helpers\ArrayHelper;
use yii\web\Controller;
use yii\web\NotFoundHttpException;

class ApiController extends Controller
{

    public $enableCsrfValidation = false;

    /**
     * Проверяем логин и пароль пользователя
     * @throws NotFoundHttpException
     */
    public function actionLogin()
    {
        if (\Yii::$app->request->isPost) {
            $password = \Yii::$app->request->post('password', '');
            $login    = \Yii::$app->request->post('login', '');

            if (!empty($password) && !empty($login) && $this->checkUser($login, $password)) {
                $position = ArrayHelper::map(Position::find()->all(), 'id', 'position_name');

                $users = $this->getUsers();
                $key   = $this->getHash($login, $password);
                echo json_encode([
                    'status'   => 'ok',
                    'key'      => $key,
                    'login'    => $login,
                    'position' => $position,
                    'users'    => $users
                ]);

            } else {
                echo json_encode(['status' => 'error']);
            }
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    /**
     * Записываем в базу пришедшего юзера
     * @throws NotFoundHttpException
     */
    public function actionCreate()
    {
        if (\Yii::$app->request->isPost) {
            $post = \Yii::$app->request->post();

            $auth = $this->getPassword(ArrayHelper::getValue($post, 'secret', ''));

            if (!empty($auth[1]) && $this->checkUser($auth[0], $auth[1])) {
                $users               = new Users();
                $users->position_id  = trim(ArrayHelper::getValue($post, 'position', ''));
                $users->name         = trim(ArrayHelper::getValue($post, 'name', ''));
                $users->mail         = trim(ArrayHelper::getValue($post, 'email', ''));
                $users->phone        = trim(ArrayHelper::getValue($post, 'phone', ''));
                $users->url          = trim(ArrayHelper::getValue($post, 'url', ''));
                $users->date_created = date('Y-m-d H:i:s');
                if ($users->save()) {
                    echo 'ok';
                }
            }
            exit;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    /**
     * Проерка пользователя и пароля
     * @param $login
     * @param $password
     * @return bool
     * @throws \yii\base\InvalidConfigException
     */
    private function checkUser($login, $password)
    {
        $user = User::findOne([
            'username' => $login
        ]);

        if (!empty($user)) {
            return \Yii::$app->security->validatePassword($password, $user->password_hash);
        }

        return false;
    }

    /**
     * Список юзеров в базе
     * @return array|\yii\db\ActiveRecord[]
     */
    private function getUsers()
    {
        return Users::find()->select(['mail', 'phone'])->asArray()->all();
    }


    /**
     *
     * @param $key
     * @return string
     */
    /**
     * Получаем пароль из хеша
     * @param $key
     * @return array
     */
    private function getPassword($key)
    {
        if ($key) {
            return explode('~', base64_decode(substr($key, 0, -20) . "="));
        }

        return [];
    }

    /**
     * Хеш для работы с базой
     * @param $login
     * @param $password
     * @return string
     */
    private function getHash($login, $password)
    {
        $arr = ['a', 'b', 'c', 'd', 'e', 'f',
                'g', 'h', 'i', 'j', 'k', 'l',
                'm', 'n', 'o', 'p', 'r', 's',
                't', 'u', 'v', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'R', 'S',
                'T', 'U', 'V', 'X', 'Y', 'Z',
                '1', '2', '3', '4', '5', '6',
                '7', '8', '9', '0'];

        $pass = "";
        for ($i = 0; $i < 20; $i++) {
            $index = rand(0, count($arr) - 1);
            $pass .= $arr[$index];
        }

        return substr(base64_encode($login . '~' . $password), 0, -1) . $pass;
    }
}