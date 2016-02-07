<?php


/**
 * Comment here for explanation of the options.
 *
 * Create a new XMPP Object with the required params
 *
 * @param string $jabberHost Jabber Server Host
 * @param string $boshUri    Full URI to the http-bind
 * @param string $resource   Resource identifier
 * @param bool   $useSsl     Use SSL (not working yet, TODO)
 * @param bool   $debug      Enable debug
 */


$sessionInfo = \GO\Chat\ChatModule::getPrebindInfo();


$GO_SCRIPTS_JS .= '
	
	var converseJs = Ext.DomHelper.append(Ext.getBody(),
		{
			tag: "div",
			id: "conversejs"
		},true);
				
	require(["converse"], function (converse) {
        converse.initialize({
								//allow_chat_pending_contacts: true,
								bosh_service_url: "' . \GO\Chat\ChatModule::getBoshUri() . '", // Please use this connection manager only for testing purposes
								roster_groups: true,
								auto_login: true,
								authentication: "login",
								play_sounds: true,
                                allow_otr: true,
                                auto_list_rooms: true,
                                //auto_subscribe: true,
                                debug: false,
                                hide_muc_server: true,
                                i18n: locales["'.GO::language()->getLanguage().'"], // Refer to ./locale/locales.js to see which locales are supported
                                show_controlbox_by_default: true,
                                xhr_user_search: false,
								jid: "'.GO::user()->username.'@puan.ddns.net",
								password: "epsilon@30",
                                //fullname: "'.GO::user()->name.'"
								
								allow_registration: false
                });


		var name = converseJs.select("input.new-chatroom-name");
		name.value="conference.' . \GO\Chat\ChatModule::getXmppHost() . '";
			
		var nick = converseJs.select("input.new-chatroom-nick");
		nick.value="'.\GO\Base\Util\String::escape_javascript(GO::user()->name).'";

});








';
