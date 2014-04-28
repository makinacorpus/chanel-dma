from zope import interface
from zope import component
from Acquisition import aq_inner
import urllib
import os

from plone.memoize.instance import memoize
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from collective.flowplayer.utils import properties_to_dict, \
                                        flash_properties_to_dict
from collective.flowplayer.interfaces import IFlowPlayable
from collective.flowplayer.interfaces import IMediaInfo, IFlowPlayerView
from collective.flowplayer.browser.view import File, Folder


class ChanelFile(File):

    def videos(self):
        return[dict(url=self.href(),
                    title=self.context.Title(),
                    description=self.context.Description(),
                    id=self.getId,
                    height=self.height,
                    width=self.width,
                    audio_only=self._audio_only)]


class ChanelFolder(Folder):

    @memoize
    def videos(self):
        results = []
        for brain in self._query():
            video = brain.getObject()
            if not IFlowPlayable.providedBy(video):
                continue
            view = component.getMultiAdapter(
                (video, self.request), interface.Interface, 'flowplayer')
            results.append(dict(url=view.href(),
                                title=brain.Title,
                                description=brain.Description,
                                id=brain.getId,
                                height=view.height,
                                width=view.width,
                                audio_only=view.audio_only()))
        return results