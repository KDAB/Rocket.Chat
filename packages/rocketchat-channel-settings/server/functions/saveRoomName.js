import { Meteor } from 'meteor/meteor';
import { Rooms, Messages, Subscriptions } from 'meteor/rocketchat:models';
import { roomTypes, getValidRoomName } from 'meteor/rocketchat:utils';

export const saveRoomName = function(rid, displayName, user, sendMessage = true) {
	const room = Rooms.findOneById(rid);
	if (roomTypes.roomTypes[room.t].preventRenaming()) {
		throw new Meteor.Error('error-not-allowed', 'Not allowed', {
			function: 'RocketChat.saveRoomdisplayName',
		});
	}
	if (displayName === room.name) {
		return;
	}

	const slugifiedRoomName = getValidRoomName(displayName, rid);

	const update = Rooms.setNameById(rid, slugifiedRoomName, displayName) && Subscriptions.updateNameAndAlertByRoomId(rid, slugifiedRoomName, displayName);

	if (update && sendMessage) {
		Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rid, displayName, user);
	}
	return displayName;
};
